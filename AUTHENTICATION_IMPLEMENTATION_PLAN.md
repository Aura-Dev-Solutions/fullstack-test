# Secure Authentication System - Implementation Plan
## Expert Analysis & Step-by-Step Guide

### Current State Analysis

#### Security Issues Identified

1. **Long-Lived Access Tokens** (24 hours)
   - Critical Risk: If token is stolen, attacker has 24-hour access
   - Industry Standard: 15-30 minutes maximum
   - Current Implementation: `backend/src/modules/auth/infrastructure/JwtTokenGenerator.ts:5`

2. **No Refresh Token Mechanism**
   - Users must re-login every 24 hours (poor UX)
   - No way to maintain persistent sessions
   - Cannot revoke sessions (security risk)

3. **No Token Rotation**
   - Same token valid for 24 hours
   - Stolen tokens remain valid until expiration
   - No defense against token replay attacks

4. **Client-Side Storage in localStorage**
   - Vulnerable to XSS attacks
   - No HttpOnly protection
   - Current: `frontend/src/services/auth.service.ts:38-42`

5. **No Session Management**
   - Cannot track active sessions
   - Cannot force logout from all devices
   - No visibility into compromised accounts

#### Architecture Strengths

✅ **Clean Architecture Pattern** - Domain layer properly separated
✅ **TypeORM Integration** - Easy to add new entities
✅ **Dependency Injection** - Testable and extensible
✅ **TypeScript Throughout** - Type-safe implementation

---

## 2025 Security Best Practices

Based on latest research from Auth0, JWT.app, and Curity:

### Token Lifetime Standards
- **Access Token**: 15 minutes (down from 24 hours)
- **Refresh Token**: 7-30 days (configurable)
- **Rotation**: Single-use refresh tokens

### Security Patterns
1. **Refresh Token Rotation**: Replace refresh token on every use
2. **Token Revocation**: Store and check revoked tokens
3. **Reuse Detection**: If old refresh token reused, revoke entire token family
4. **Secure Storage**: Database encryption for refresh tokens

### Implementation Requirements
- Store refresh tokens in database (PostgreSQL via TypeORM)
- Hash/encrypt tokens before storage
- Track token families for reuse detection
- Implement automatic token refresh on frontend
- Handle 401 errors gracefully with retry logic

---

## Minimal Implementation Plan

### Design Philosophy: **Surgical Precision**

Minimize changes while maximizing security improvement:
- ✅ Preserve existing architecture patterns
- ✅ Keep clean architecture separation
- ✅ No breaking changes to existing code
- ✅ Backwards compatible during transition
- ✅ Focus on security essentials first

---

## Step-by-Step Implementation

### Phase 1: Backend Foundation (90 minutes)

#### Step 1.1: Create Refresh Token Domain Model (15 min)

**File**: `backend/src/modules/auth/domain/RefreshToken.ts` (NEW)

```typescript
export interface RefreshToken {
  id: string
  token: string // Hashed token
  userId: string
  expiresAt: Date
  createdAt: Date
  revokedAt: Date | null
  replacedByToken: string | null // For rotation tracking
}
```

**File**: `backend/src/modules/auth/domain/RefreshTokenRepository.ts` (NEW)

```typescript
import type { RefreshToken } from './RefreshToken'

export interface RefreshTokenRepository {
  create(token: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken>
  findByToken(token: string): Promise<RefreshToken | null>
  revokeToken(token: string, replacedBy?: string): Promise<void>
  revokeAllForUser(userId: string): Promise<void>
  deleteExpired(): Promise<void>
}
```

**File**: Update `backend/src/modules/auth/domain/index.ts`

```typescript
// Add these exports
export * from './RefreshToken'
export * from './RefreshTokenRepository'
```

---

#### Step 1.2: Create TypeORM Entity (15 min)

**File**: `backend/src/modules/auth/infrastructure/RefreshTokenEntity.ts` (NEW)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { UserEntity } from '@modules/users/infrastructure/UserEntity'

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  token!: string // Will store hashed token

  @Column({ type: 'uuid' })
  userId!: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity

  @Column({ type: 'timestamp' })
  expiresAt!: Date

  @CreateDateColumn()
  createdAt!: Date

  @Column({ type: 'timestamp', nullable: true })
  revokedAt!: Date | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  replacedByToken!: string | null
}
```

**File**: Update `backend/src/shared/infrastructure/database/data-source.ts`

```typescript
// Add to entities array
import { RefreshTokenEntity } from '@modules/auth/infrastructure/RefreshTokenEntity'

// In DataSource config
entities: [
  OrganizationEntity,
  UserEntity,
  ContactEntity,
  WorkflowEntity,
  StageEntity,
  DealEntity,
  RefreshTokenEntity, // ADD THIS
]
```

---

#### Step 1.3: Implement Repository (20 min)

**File**: `backend/src/modules/auth/infrastructure/PostgresRefreshTokenRepository.ts` (NEW)

```typescript
import type { DataSource, Repository } from 'typeorm'
import type { RefreshToken, RefreshTokenRepository } from '../domain'
import { RefreshTokenEntity } from './RefreshTokenEntity'
import { createHash } from 'crypto'

export class PostgresRefreshTokenRepository implements RefreshTokenRepository {
  private readonly repository: Repository<RefreshTokenEntity>

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(RefreshTokenEntity)
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  async create(data: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken> {
    const entity = this.repository.create({
      token: this.hashToken(data.token),
      userId: data.userId,
      expiresAt: data.expiresAt,
      revokedAt: data.revokedAt,
      replacedByToken: data.replacedByToken ? this.hashToken(data.replacedByToken) : null,
    })

    const saved = await this.repository.save(entity)
    return this.toDomain(saved)
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const hashedToken = this.hashToken(token)
    const entity = await this.repository.findOne({
      where: { token: hashedToken },
    })

    return entity ? this.toDomain(entity) : null
  }

  async revokeToken(token: string, replacedBy?: string): Promise<void> {
    const hashedToken = this.hashToken(token)
    await this.repository.update(
      { token: hashedToken },
      {
        revokedAt: new Date(),
        replacedByToken: replacedBy ? this.hashToken(replacedBy) : null,
      }
    )
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId, revokedAt: null },
      { revokedAt: new Date() }
    )
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: { $lt: new Date() } as any,
    })
  }

  private toDomain(entity: RefreshTokenEntity): RefreshToken {
    return {
      id: entity.id,
      token: entity.token,
      userId: entity.userId,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      revokedAt: entity.revokedAt,
      replacedByToken: entity.replacedByToken,
    }
  }
}
```

---

#### Step 1.4: Update Token Generator (20 min)

**File**: Update `backend/src/modules/auth/domain/TokenGenerator.ts`

```typescript
import type { AuthToken } from './Auth'

export interface TokenPayload {
  userId: string
  organizationId: string
}

export interface RefreshTokenResponse {
  refreshToken: string
  expiresAt: Date
}

export interface TokenGenerator {
  generate(userId: string, organizationId: string): AuthToken
  generateRefreshToken(): RefreshTokenResponse // ADD THIS
  verify(token: string): TokenPayload | null
}
```

**File**: Update `backend/src/modules/auth/infrastructure/JwtTokenGenerator.ts`

```typescript
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import type { AuthToken, TokenGenerator, TokenPayload, RefreshTokenResponse } from '../domain'

export class JwtTokenGenerator implements TokenGenerator {
  // CHANGE: Reduce from 24h to 15 minutes
  private readonly accessTokenExpiresInMs = 15 * 60 * 1000 // 15 minutes
  private readonly refreshTokenExpiresInMs = 7 * 24 * 60 * 60 * 1000 // 7 days

  constructor(private readonly secret: string) {}

  generate(userId: string, organizationId: string): AuthToken {
    const expiresAt = new Date(Date.now() + this.accessTokenExpiresInMs)

    const accessToken = jwt.sign(
      { userId, organizationId } satisfies TokenPayload,
      this.secret,
      { expiresIn: '15m' } // CHANGE: from '24h' to '15m'
    )

    return {
      accessToken,
      expiresAt,
    }
  }

  // NEW METHOD
  generateRefreshToken(): RefreshTokenResponse {
    const refreshToken = randomBytes(64).toString('hex')
    const expiresAt = new Date(Date.now() + this.refreshTokenExpiresInMs)

    return {
      refreshToken,
      expiresAt,
    }
  }

  verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload
      return decoded
    } catch {
      return null
    }
  }
}
```

---

#### Step 1.5: Update Auth Use Cases (20 min)

**File**: Update `backend/src/modules/auth/domain/Auth.ts`

```typescript
export interface RegisterDTO {
  name: string
  email: string
  password: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthToken {
  accessToken: string
  expiresAt: Date
}

// ADD THIS
export interface RefreshTokenDTO {
  refreshToken: string
}

export interface AuthUser {
  id: string
  organizationId: string | null
  name: string
  email: string
  password: string
  createdAt: Date
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    organizationId: string | null
  }
  token: AuthToken
  refreshToken: string // ADD THIS
}
```

**File**: Update `backend/src/modules/auth/application/AuthUseCases.ts`

```typescript
import type {
  RegisterDTO,
  LoginDTO,
  RefreshTokenDTO, // ADD
  AuthResponse,
  AuthRepository,
  PasswordHasher,
  TokenGenerator,
  RefreshTokenRepository, // ADD
} from '../domain'
import type { OrganizationRepository } from '@modules/organization/domain'
import type { WorkflowRepository } from '@modules/workflow/domain'

export class AuthUseCases {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
    private readonly organizationRepository: OrganizationRepository,
    private readonly workflowRepository: WorkflowRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository // ADD
  ) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const organization = await this.organizationRepository.create({
      name: `${data.name}'s Organization`,
    })

    await this.workflowRepository.create({
      organizationId: organization.id,
      name: 'Sales Pipeline',
      stages: [
        { name: 'Lead', order: 1, color: '#6B7280' },
        { name: 'Qualified', order: 2, color: '#3B82F6' },
        { name: 'Proposal', order: 3, color: '#8B5CF6' },
        { name: 'Negotiation', order: 4, color: '#F59E0B' },
        { name: 'Won', order: 5, color: '#10B981' },
        { name: 'Lost', order: 6, color: '#EF4444' },
      ],
    })

    const hashedPassword = await this.passwordHasher.hash(data.password)

    const user = await this.authRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      hashedPassword,
      organizationId: organization.id,
    })

    const token = this.tokenGenerator.generate(user.id, organization.id)

    // ADD: Generate and store refresh token
    const { refreshToken, expiresAt } = this.tokenGenerator.generateRefreshToken()
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
      revokedAt: null,
      replacedByToken: null,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      token,
      refreshToken, // ADD
    }
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(data.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await this.passwordHasher.verify(
      data.password,
      user.password
    )
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    if (!user.organizationId) {
      throw new Error('User has no organization')
    }

    const token = this.tokenGenerator.generate(user.id, user.organizationId)

    // ADD: Revoke old refresh tokens and generate new one
    await this.refreshTokenRepository.revokeAllForUser(user.id)

    const { refreshToken, expiresAt } = this.tokenGenerator.generateRefreshToken()
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt,
      revokedAt: null,
      replacedByToken: null,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      token,
      refreshToken, // ADD
    }
  }

  // NEW METHOD: Refresh access token
  async refresh(data: RefreshTokenDTO): Promise<AuthResponse> {
    const storedToken = await this.refreshTokenRepository.findByToken(data.refreshToken)

    // Validate token exists
    if (!storedToken) {
      throw new Error('Invalid refresh token')
    }

    // Check if revoked
    if (storedToken.revokedAt) {
      // Token reuse detected - potential attack
      await this.refreshTokenRepository.revokeAllForUser(storedToken.userId)
      throw new Error('Token reuse detected. All sessions have been revoked.')
    }

    // Check if expired
    if (storedToken.expiresAt < new Date()) {
      throw new Error('Refresh token expired')
    }

    // Get user details
    const user = await this.authRepository.findById(storedToken.userId)
    if (!user || !user.organizationId) {
      throw new Error('User not found')
    }

    // Generate new access token
    const token = this.tokenGenerator.generate(user.id, user.organizationId)

    // Generate new refresh token (rotation)
    const { refreshToken: newRefreshToken, expiresAt } = this.tokenGenerator.generateRefreshToken()

    // Revoke old token and link to new one
    await this.refreshTokenRepository.revokeToken(data.refreshToken, newRefreshToken)

    // Store new refresh token
    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
      revokedAt: null,
      replacedByToken: null,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
      token,
      refreshToken: newRefreshToken,
    }
  }

  // NEW METHOD: Logout
  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.revokeToken(refreshToken)
  }

  // NEW METHOD: Logout from all devices
  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllForUser(userId)
  }
}
```

**Note**: You'll need to add `findById` to `AuthRepository` interface:

```typescript
// In backend/src/modules/auth/domain/AuthRepository.ts
findById(id: string): Promise<AuthUser | null>
```

And implement it in the Postgres repository.

---

#### Step 1.6: Update Controller & Routes (20 min)

**File**: Update `backend/src/modules/auth/http/AuthController.ts`

```typescript
import type { Request, Response } from 'express'
import type { AuthUseCases } from '../application'
import type { AuthenticatedRequest } from '@shared/http'

export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' })
      return
    }

    try {
      const result = await this.authUseCases.register({ name, email, password })
      res.status(201).json(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({ error: error.message })
        return
      }
      throw error
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    try {
      const result = await this.authUseCases.login({ email, password })
      res.json(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid credentials')) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }
      throw error
    }
  }

  // NEW METHOD
  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' })
      return
    }

    try {
      const result = await this.authUseCases.refresh({ refreshToken })
      res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('reuse detected')) {
          res.status(401).json({ error: error.message })
          return
        }
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
          res.status(401).json({ error: error.message })
          return
        }
      }
      throw error
    }
  }

  // NEW METHOD
  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' })
      return
    }

    try {
      await this.authUseCases.logout(refreshToken)
      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      throw error
    }
  }

  // NEW METHOD
  async logoutAll(req: Request, res: Response): Promise<void> {
    const authReq = req as AuthenticatedRequest

    try {
      await this.authUseCases.logoutAll(authReq.user.userId)
      res.json({ message: 'Logged out from all devices' })
    } catch (error) {
      throw error
    }
  }
}
```

**File**: Update `backend/src/modules/auth/http/AuthRoutes.ts` (or create if doesn't exist)

```typescript
import { Router } from 'express'
import type { AuthController } from './AuthController'
import type { RequestHandler } from 'express'

export function createAuthRoutes(
  controller: AuthController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.post('/register', (req, res) => controller.register(req, res))
  router.post('/login', (req, res) => controller.login(req, res))
  router.post('/refresh', (req, res) => controller.refresh(req, res)) // NEW
  router.post('/logout', (req, res) => controller.logout(req, res)) // NEW
  router.post('/logout-all', authMiddleware, (req, res) => controller.logoutAll(req, res)) // NEW (protected)

  return router
}
```

---

#### Step 1.7: Update Dependency Injection (10 min)

**File**: Update `backend/src/app.ts`

```typescript
// Add import
import { PostgresRefreshTokenRepository } from '@modules/auth/infrastructure/PostgresRefreshTokenRepository'

// In createApp function, after other repository initializations:

// Auth setup
const refreshTokenRepository = new PostgresRefreshTokenRepository(dataSource)

const authUseCases = new AuthUseCases(
  authRepository,
  passwordHasher,
  tokenGenerator,
  organizationRepository,
  workflowRepository,
  refreshTokenRepository // ADD THIS
)

// ... rest of the code
```

---

### Phase 2: Frontend Implementation (60 minutes)

#### Step 2.1: Update Auth Service (15 min)

**File**: Update `frontend/src/services/auth.service.ts`

```typescript
import { api } from './api'

export interface User {
  id: string
  name: string
  email: string
  organizationId: string | null
}

export interface AuthToken {
  accessToken: string
  expiresAt: string
}

export interface AuthResponse {
  user: User
  token: AuthToken
  refreshToken: string // ADD
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<AuthResponse>('/auth/register', credentials),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post<{ message: string }>('/auth/logout', { refreshToken }),

  logoutAll: () =>
    api.post<{ message: string }>('/auth/logout-all', {}),

  getToken: () => localStorage.getItem('token'),

  setToken: (token: string) => localStorage.setItem('token', token),

  removeToken: () => localStorage.removeItem('token'),

  getRefreshToken: () => localStorage.getItem('refreshToken'), // ADD

  setRefreshToken: (token: string) => localStorage.setItem('refreshToken', token), // ADD

  removeRefreshToken: () => localStorage.removeItem('refreshToken'), // ADD

  isAuthenticated: () => !!localStorage.getItem('token'),
}
```

---

#### Step 2.2: Update API Client with Auto-Refresh (25 min)

**File**: Update `frontend/src/services/api.ts`

```typescript
import { authService } from './auth.service'

const API_BASE = '/api'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const refreshToken = authService.getRefreshToken()

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refresh(refreshToken)

      // Store new tokens
      authService.setToken(response.token.accessToken)
      authService.setRefreshToken(response.refreshToken)

      return response.token.accessToken
    } catch (error) {
      // Refresh failed - clear tokens and redirect to login
      authService.removeToken()
      authService.removeRefreshToken()
      localStorage.removeItem('user')
      window.location.href = '/login'
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  // Handle 401 - try to refresh token
  if (response.status === 401 && !endpoint.includes('/auth/')) {
    try {
      const newToken = await refreshAccessToken()

      // Retry request with new token
      headers['Authorization'] = `Bearer ${newToken}`
      response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      })
    } catch (refreshError) {
      // Refresh failed, let the error propagate
      throw new ApiError(401, 'Authentication failed')
    }
  }

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Request failed')
  }

  return data
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
}

export { ApiError }
```

---

#### Step 2.3: Update Auth Context (20 min)

**File**: Update `frontend/src/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { authService, type User } from '../services'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, refreshToken: string, user: User) => void
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = authService.getToken()
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((newToken: string, newRefreshToken: string, newUser: User) => {
    authService.setToken(newToken)
    authService.setRefreshToken(newRefreshToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = authService.getRefreshToken()

    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    authService.removeToken()
    authService.removeRefreshToken()
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll()
    } catch (error) {
      console.error('Logout all error:', error)
    }

    authService.removeToken()
    authService.removeRefreshToken()
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        logoutAll,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

---

#### Step 2.4: Update Login/Register Pages (10 min)

**File**: Update `frontend/src/pages/LoginPage.tsx`

```typescript
// In the handleSubmit function, change:
const response = await authService.login({ email, password })
login(response.token.accessToken, response.refreshToken, response.user) // ADD refreshToken
```

**File**: Update `frontend/src/pages/RegisterPage.tsx`

```typescript
// In the handleSubmit function, change:
const response = await authService.register({ name, email, password })
login(response.token.accessToken, response.refreshToken, response.user) // ADD refreshToken
```

---

### Phase 3: Database Migration (10 minutes)

#### Step 3.1: Generate Migration

```bash
cd backend
pnpm migration:generate src/shared/infrastructure/database/migrations/AddRefreshTokens
```

#### Step 3.2: Run Migration

```bash
pnpm migration:run
```

---

### Phase 4: Testing (30 minutes)

#### Step 4.1: Manual Testing Checklist

1. **Registration Flow**
   - [ ] Register new user
   - [ ] Verify refresh token returned
   - [ ] Check database for refresh token entry

2. **Login Flow**
   - [ ] Login with credentials
   - [ ] Verify both tokens returned
   - [ ] Check old refresh tokens revoked

3. **Token Refresh**
   - [ ] Wait for access token to expire (or manually expire it)
   - [ ] Make API call
   - [ ] Verify automatic refresh happens
   - [ ] Check new tokens issued

4. **Logout**
   - [ ] Logout single device
   - [ ] Verify refresh token revoked
   - [ ] Try to use old refresh token (should fail)

5. **Logout All**
   - [ ] Login from multiple "devices" (different browser tabs)
   - [ ] Logout all
   - [ ] Verify all refresh tokens revoked

6. **Security Tests**
   - [ ] Try to reuse revoked refresh token (should fail)
   - [ ] Try to use expired refresh token (should fail)
   - [ ] Verify token rotation works

---

## Minimal File Changes Summary

### New Files (7)
1. `backend/src/modules/auth/domain/RefreshToken.ts`
2. `backend/src/modules/auth/domain/RefreshTokenRepository.ts`
3. `backend/src/modules/auth/infrastructure/RefreshTokenEntity.ts`
4. `backend/src/modules/auth/infrastructure/PostgresRefreshTokenRepository.ts`
5. `backend/src/modules/auth/http/AuthRoutes.ts` (if doesn't exist)
6. Database migration file

### Modified Files (10)
1. `backend/src/modules/auth/domain/index.ts` - Add exports
2. `backend/src/modules/auth/domain/TokenGenerator.ts` - Add refresh method
3. `backend/src/modules/auth/domain/Auth.ts` - Add refreshToken to response
4. `backend/src/modules/auth/infrastructure/JwtTokenGenerator.ts` - Reduce token lifetime, add refresh generation
5. `backend/src/modules/auth/application/AuthUseCases.ts` - Add refresh/logout methods
6. `backend/src/modules/auth/http/AuthController.ts` - Add new endpoints
7. `backend/src/shared/infrastructure/database/data-source.ts` - Register entity
8. `backend/src/app.ts` - Wire up dependencies
9. `frontend/src/services/api.ts` - Add auto-refresh logic
10. `frontend/src/services/auth.service.ts` - Add refresh token methods
11. `frontend/src/context/AuthContext.tsx` - Update login/logout
12. `frontend/src/pages/LoginPage.tsx` - Pass refresh token
13. `frontend/src/pages/RegisterPage.tsx` - Pass refresh token

---

## Security Improvements Achieved

✅ **Short-Lived Access Tokens**: 15 minutes (down from 24 hours)
✅ **Refresh Token Rotation**: New token on every refresh
✅ **Token Revocation**: Can invalidate sessions
✅ **Reuse Detection**: Revokes all tokens on suspicious activity
✅ **Automatic Refresh**: Seamless UX, no manual re-login
✅ **Logout All Devices**: Security feature for compromised accounts
✅ **Token Hashing**: Refresh tokens hashed in database
✅ **Expiration Tracking**: Both access and refresh tokens expire

---

## What's NOT Included (Out of Scope)

To keep this minimal, we're NOT implementing:
- ❌ HttpOnly cookies (keeping localStorage for now)
- ❌ CSRF protection (would need with cookies)
- ❌ Redis for token blacklist (using PostgreSQL)
- ❌ Rate limiting on endpoints
- ❌ Session management UI
- ❌ Device/location tracking
- ❌ Email notifications on login
- ❌ Comprehensive unit tests (write basic ones)

These can be added in Phase 2 if time permits or as bonus points.

---

## Time Estimate Breakdown

- **Backend Domain & Infrastructure**: 60 min
- **Backend Use Cases & Controller**: 40 min
- **Frontend**: 50 min
- **Database Migration**: 10 min
- **Testing**: 30 min
- **Buffer**: 30 min

**Total: ~3.5 hours** (fits within Day 1 morning session)

---

## Research Sources

Based on 2025 best practices from:

- [What Are Refresh Tokens - Auth0](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)
- [Token Best Practices - Auth0 Docs](https://auth0.com/docs/secure/tokens/token-best-practices)
- [Refresh Token Rotation - Serverion](https://www.serverion.com/uncategorized/refresh-token-rotation-best-practices-for-developers/)
- [JWT Security Best Practices 2025 - JWT.app](https://jwt.app/blog/jwt-best-practices/)
- [JWT Security Vulnerabilities - APIsec](https://www.apisec.ai/blog/jwt-security-vulnerabilities-prevention)
- [Refresh Token Rotation - Auth.js](https://authjs.dev/guides/refresh-token-rotation)
- [JWT Best Practices Checklist - Curity](https://curity.io/resources/learn/jwt-best-practices/)
- [JWT Refresh Token Implementation - Medium](https://tsvillain.medium.com/json-web-tokens-jwt-refresh-tokens-the-complete-backend-guide-271bdf0e7b49)
- [NestJS JWT Refresh Token - Medium](https://tushar-chy.medium.com/jwt-refresh-token-generator-in-nestjs-application-54c5ab2c0da3)

---

## Next Steps

After completing this implementation:

1. ✅ Test thoroughly with all scenarios
2. ✅ Add basic unit tests for critical paths
3. ✅ Update API documentation (if time permits)
4. ✅ Consider adding a cleanup cron job for expired tokens
5. ✅ Move to Challenge 2 (Data Validation)
