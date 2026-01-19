import crypto from "crypto";

export interface RefreshTokenPayload {
  token: string;
  hash: string;
  expiresAt: Date;
}

export class RefreshTokenService {
  // Refresh token TTL set to 7 days
  private readonly expiresInMs: number = 7 * 24 * 60 * 60 * 1000;

  generate(): RefreshTokenPayload {
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + this.expiresInMs);

    return {
      token,
      hash,
      expiresAt,
    };
  }

  getMaxAgeMs(): number {
    return this.expiresInMs;
  }
}
