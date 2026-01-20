import { Router, type RequestHandler } from 'express'
import type { OrganizationController } from './OrganizationController'
import { validateRequest } from '@shared/validation'
import { asyncHandler } from '@shared/http'
import { organizationSchema, updateOrganizationSchema } from '@shared/validation/schemas'

export function createOrganizationRoutes(
  controller: OrganizationController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.use(authMiddleware)

  router.get(
    "/",
    validateRequest(organizationSchema),
    asyncHandler((req, res) => controller.getById(req as any, res)),
  );
  router.put(
    "/",
    validateRequest(updateOrganizationSchema),
    asyncHandler((req, res) => controller.update(req as any, res)),
  );

  return router
}
