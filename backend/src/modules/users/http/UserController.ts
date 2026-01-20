import type { Request, Response } from 'express'
import { created, noContent, ok } from '@shared/http'
import { notFound } from '@shared/errors'
import type { UserUseCases } from '../application'

export class UserController {
  constructor(private readonly userUseCases: UserUseCases) {}

  async getAll(_req: Request, res: Response): Promise<void> {
    const users = await this.userUseCases.getAllUsers()
    ok(res, users)
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const user = await this.userUseCases.getUserById(id)
    if (!user) throw notFound('User not found')
    ok(res, user)
  }

  async create(req: Request, res: Response): Promise<void> {
    const { name, email } = req.body
    const user = await this.userUseCases.createUser({ name, email })
    created(res, user)
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const deleted = await this.userUseCases.deleteUser(id)
    if (!deleted) throw notFound("User not found")
    noContent(res)
  }
}
