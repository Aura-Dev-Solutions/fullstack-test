import { Router, type RequestHandler } from 'express'
import type { WorkflowController } from './WorkflowController'
import { validateRequest } from '@shared/validation'
import { asyncHandler } from '@shared/http'
import {
  createStageSchema,
  createWorkflowSchema,
  stageIdSchema,
  updateStageSchema,
  updateWorkflowSchema,
  workflowIdSchema,
  workflowListSchema,
} from '@shared/validation/schemas'

export function createWorkflowRoutes(
  controller: WorkflowController,
  authMiddleware: RequestHandler
): Router {
  const router = Router()

  router.use(authMiddleware);

  router.get(
    "/",
    validateRequest(workflowListSchema),
    asyncHandler((req, res) => controller.getAll(req as any, res)),
  );
  router.get(
    "/:id",
    validateRequest(workflowIdSchema),
    asyncHandler((req, res) => controller.getById(req as any, res)),
  );
  router.post(
    "/",
    validateRequest(createWorkflowSchema),
    asyncHandler((req, res) => controller.create(req as any, res)),
  );
  router.put(
    "/:id",
    validateRequest(updateWorkflowSchema),
    asyncHandler((req, res) => controller.update(req as any, res)),
  );
  router.delete(
    "/:id",
    validateRequest(workflowIdSchema),
    asyncHandler((req, res) => controller.delete(req as any, res)),
  );
  
  // Stage routes
  router.post(
    "/:id/stages",
    validateRequest(createStageSchema),
    asyncHandler((req, res) => controller.addStage(req as any, res)),
  );
  router.put(
    "/:id/stages/:stageId",
    validateRequest(updateStageSchema),
    asyncHandler((req, res) => controller.updateStage(req as any, res)),
  );
  router.delete(
    "/:id/stages/:stageId",
    validateRequest(stageIdSchema),
    asyncHandler((req, res) => controller.deleteStage(req as any, res)),
  );

  return router
}
