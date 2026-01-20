import { Router } from 'express'
import type { UserController } from './UserController'
import { validateRequest } from '@shared/validation'
import { asyncHandler } from '@shared/http'
import { createUserSchema, userIdSchema, userSchema } from '@shared/validation/schemas'

export function createUserRoutes(controller: UserController): Router {
  const router = Router()

  router.get(
    "/",
    validateRequest(userSchema),
    asyncHandler((req, res) => controller.getAll(req, res)),
  );
  router.get(
    "/:id",
    validateRequest(userIdSchema),
    asyncHandler((req, res) => controller.getById(req, res)),
  );
  router.post(
    "/",
    validateRequest(createUserSchema),
    asyncHandler((req, res) => controller.create(req, res)),
  );
  router.delete(
    "/:id",
    validateRequest(userIdSchema),
    asyncHandler((req, res) => controller.delete(req, res)),
  );

  return router
}
