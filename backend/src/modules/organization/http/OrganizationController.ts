import type { Response } from 'express'
import type { AuthenticatedRequest } from '@shared/http'
import { ok } from '@shared/http'
import { notFound } from '@shared/errors'
import type { OrganizationUseCases } from '../application'

export class OrganizationController {
  constructor(private readonly organizationUseCases: OrganizationUseCases) {}

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const organization = await this.organizationUseCases.getOrganizationById(organizationId)
    if (!organization) throw notFound('Organization not found')
    ok(res, organization)
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { organizationId } = req.user
    const { name } = req.body
    const organization = await this.organizationUseCases.updateOrganization(organizationId, {
      name,
    })
    if (!organization) throw notFound('Organization not found')
    ok(res, organization)
  }
}
