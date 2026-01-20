import { Router } from "express";
import type { AuthController } from "./AuthController";
import { validateRequest } from "@shared/validation";
import { asyncHandler } from "@shared/http";
import {
  loginSchema,
  registerSchema,
  refreshSchema,
} from "@shared/validation/schemas";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.post(
    "/register",
    validateRequest(registerSchema),
    asyncHandler((req, res) => controller.register(req, res)),
  );

  router.post(
    "/login",
    validateRequest(loginSchema),
    asyncHandler((req, res) => controller.login(req, res)),
  );

  router.post(
    "/refresh",
    validateRequest(refreshSchema),
    asyncHandler((req, res) => controller.refresh(req, res)),
  );

  router.post("/logout", (req, res) => controller.logout(req, res));

  return router;
}
