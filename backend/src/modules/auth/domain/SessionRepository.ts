import type { AuthSession } from "./Auth";

export interface CreateSessionDTO {
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
}

export interface SessionRepository {
  create(data: CreateSessionDTO): Promise<AuthSession>;

  findActiveByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<AuthSession | null>;

  revoke(sessionId: string, revokedAt?: Date): Promise<void>;

  revokeAllForUser(userId: string, revokedAt?: Date): Promise<void>;
}
