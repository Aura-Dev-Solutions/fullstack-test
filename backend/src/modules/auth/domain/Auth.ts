export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  expiresAt: Date;
}

export interface AuthUser {
  id: string;
  organizationId: string | null;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    organizationId: string | null;
  };
  token: AuthToken;
}

export interface AuthSession {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}
