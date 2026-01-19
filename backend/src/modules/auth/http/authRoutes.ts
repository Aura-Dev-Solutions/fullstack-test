import { Router } from 'express'
import type { AuthController } from './AuthController'

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router()

  router.post('/register', (req, res) => controller.register(req, res))
  router.post('/login', (req, res) => controller.login(req, res))
  router.post('/refresh', (req, res) => controller.refresh(req, res))
  router.post('/logout', (req, res) => controller.logout(req, res))

  return router
}
