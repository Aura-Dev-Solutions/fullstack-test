import { Router, type RequestHandler } from 'express'
import type { DealController } from './DealController'
import { validateRequest } from '@shared/validation'
import { asyncHandler } from '@shared/http'
import {
  createDealSchema,
  dealIdSchema,
  dealListSchema,
  updateDealSchema,
} from '@shared/validation/schemas'

export function createDealRoutes(
  controller: DealController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.use(authMiddleware)

  router.get(
    "/",
    validateRequest(dealListSchema),
    asyncHandler((req, res) => controller.getAll(req as any, res)),
  );
  router.get(
    "/:id",
    validateRequest(dealIdSchema),
    asyncHandler((req, res) => controller.getById(req as any, res)),
  );
  router.post(
    "/",
    validateRequest(createDealSchema),
    asyncHandler((req, res) => controller.create(req as any, res)),
  );
  router.put(
    "/:id",
    validateRequest(updateDealSchema),
    asyncHandler((req, res) => controller.update(req as any, res)),
  );
  router.delete(
    "/:id",
    validateRequest(dealIdSchema),
    asyncHandler((req, res) => controller.delete(req as any, res)),
  );

  return router
}
