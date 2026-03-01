import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService, type User } from '../services'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO [Challenge 3]: Validate token expiration on init. If the stored token is expired, call the refresh endpoint instead of restoring the session directly.
    const storedToken = authService.getToken()
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
    // TODO [Challenge 3]: Implement automatic token refresh using a setInterval or timeout before token expiration
  }, [])

  const login = (newToken: string, newUser: User) => {
    authService.setToken(newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    // TODO [Challenge 3]: Store the refresh token and set up automatic access token renewal before expiration
  }

  const logout = () => {
    authService.removeToken()
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
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
