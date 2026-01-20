import { Router, type RequestHandler } from 'express'
import type { ContactController } from './ContactController'
import { validateRequest } from '@shared/validation'
import { asyncHandler } from '@shared/http'
import {
  contactIdSchema,
  contactListSchema,
  createContactSchema,
  updateContactSchema,
} from '@shared/validation/schemas'

export function createContactRoutes(
  controller: ContactController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.use(authMiddleware)

  router.get(
    "/",
    validateRequest(contactListSchema),
    asyncHandler((req, res) => controller.getAll(req as any, res)),
  );
  router.get(
    "/:id",
    validateRequest(contactIdSchema),
    asyncHandler((req, res) => controller.getById(req as any, res)),
  );
  router.post(
    "/",
    validateRequest(createContactSchema),
    asyncHandler((req, res) => controller.create(req as any, res)),
  );
  router.put(
    "/:id",
    validateRequest(updateContactSchema),
    asyncHandler((req, res) => controller.update(req as any, res)),
  );
  router.delete(
    "/:id",
    validateRequest(contactIdSchema),
    asyncHandler((req, res) => controller.delete(req as any, res)),
  );

  return router
}
