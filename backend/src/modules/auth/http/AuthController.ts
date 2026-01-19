import type { Request, Response } from 'express'
import type { AuthUseCases } from '../application'

export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    try {
      const result = await this.authUseCases.register({
        name,
        email,
        password,
      });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ user: result.user, token: result.token });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ error: error.message });
        return;
      }
      throw error;
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const result = await this.authUseCases.login({ email, password });
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ user: result.user, token: result.token });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Invalid credentials")
      ) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      throw error;
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    try {
      const result = await this.authUseCases.refresh(refreshToken);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.status(200).json({ token: result.token });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Invalid refresh token")
      ) {
        res.status(401).json({ error: "Invalid refresh token" });
        return;
      }
      throw error;
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authUseCases.logout(refreshToken);
    }

    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.status(204).send();
  }
}