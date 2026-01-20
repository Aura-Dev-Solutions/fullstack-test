import { Repository, IsNull } from "typeorm";
import { AuthSession, CreateSessionDTO } from "../domain";
import { SessionEntity } from "./SessionEntity";

export class PostgresSessionRepository {
  constructor(private readonly sessionRepo: Repository<SessionEntity>) {}

  async create(data: CreateSessionDTO): Promise<AuthSession> {
    const entity = new SessionEntity();
    entity.userId = data.userId;
    entity.refreshTokenHash = data.refreshTokenHash;
    entity.expiresAt = data.expiresAt;
    entity.revokedAt = null;

    const saved = await this.sessionRepo.save(entity);
    return saved.toDomain();
  }

  async findActiveByRefreshTokenHash(
    hash: string,
  ): Promise<AuthSession | null> {
    const session = await this.sessionRepo.findOne({
      where: { refreshTokenHash: hash, revokedAt: IsNull() },
    });

    if (!session) return null;

    // Treat expired sessions as inactive
    if (session.expiresAt.getTime() <= Date.now()) return null;

    return session.toDomain();
  }

  async revoke(sessionId: string, revokedAt: Date = new Date()): Promise<void> {
    await this.sessionRepo.update({ id: sessionId }, { revokedAt });
  }

  async revokeAllForUser(
    userId: string,
    revokedAt: Date = new Date(),
  ): Promise<void> {
    await this.sessionRepo.update(
      { userId, revokedAt: IsNull() },
      { revokedAt },
    );
  }
}
