import jwt from 'jsonwebtoken'
import type { AuthToken, TokenGenerator, TokenPayload } from '../domain'

// TODO [Challenge 3]: Add a generateRefreshToken() method that creates a longer-lived token (e.g., 30 days)
export class JwtTokenGenerator implements TokenGenerator {
  private readonly expiresInMs = 24 * 60 * 60 * 1000 // 24 hours

  constructor(private readonly secret: string) {}

  generate(userId: string, organizationId: string): AuthToken {
    const expiresAt = new Date(Date.now() + this.expiresInMs)

    const accessToken = jwt.sign(
      { userId, organizationId } satisfies TokenPayload,
      this.secret,
      { expiresIn: '24h' }
    )

    return {
      accessToken,
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

  // TODO [Challenge 3]: Add token revocation support — verify against a blocklist in DB or use a short-lived access token + refresh token strategy
}
