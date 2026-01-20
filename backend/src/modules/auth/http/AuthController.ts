import type { Request, Response } from "express";
import type { AuthUseCases } from "../application";
import { ok, noContent } from "@shared/http";
import { unauthorized } from "@shared/errors";

export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  async register(req: Request, res: Response): Promise<void> {
    const { user, token, refreshToken } = await this.authUseCases.register(
      req.body,
    );
    this.setRefreshCookie(res, refreshToken);
    ok(res, { user, token });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { user, token, refreshToken } = await this.authUseCases.login(
      req.body,
    );
    this.setRefreshCookie(res, refreshToken);
    ok(res, { user, token });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw unauthorized("No refresh token provided");
    }
    const { refreshToken: newRefreshToken, token } =
      await this.authUseCases.refresh(refreshToken);
    this.setRefreshCookie(res, newRefreshToken);
    ok(res, { token });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authUseCases.logout(refreshToken);
    }

    res.clearCookie('refreshToken', { path: '/api/auth/refresh' })
    noContent(res);
  }
}
