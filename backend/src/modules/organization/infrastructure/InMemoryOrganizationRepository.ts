import type {
  Organization,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  OrganizationRepository,
} from '../domain'

export class InMemoryOrganizationRepository implements OrganizationRepository {
  private organizations: Map<string, Organization> = new Map()

  async findById(id: string): Promise<Organization | null> {
    return this.organizations.get(id) ?? null
  }

  async create(data: CreateOrganizationDTO): Promise<Organization> {
    const organization: Organization = {
      id: crypto.randomUUID(),
      name: data.name,
      createdAt: new Date(),
    }
    this.organizations.set(organization.id, organization)
    return organization
  }

  async update(id: string, data: UpdateOrganizationDTO): Promise<Organization | null> {
    const organization = this.organizations.get(id)
    if (!organization) return null

    const updated: Organization = {
      ...organization,
      name: data.name ?? organization.name,
    }
    this.organizations.set(id, updated)
    return updated
  }

  clear(): void {
    this.organizations.clear()
  }
}
