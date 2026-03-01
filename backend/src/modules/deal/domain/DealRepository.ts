import type { Deal, CreateDealDTO, UpdateDealDTO } from './Deal'

export interface DealRepository {
  // TODO [Challenge 3]: Add PaginationOptions parameter: findAllByOrganization(organizationId: string, options?: PaginationOptions): Promise<PaginatedResult<Deal>>
  findAllByOrganization(organizationId: string): Promise<Deal[]>
  findById(id: string): Promise<Deal | null>
  create(data: CreateDealDTO): Promise<Deal>
  update(id: string, data: UpdateDealDTO): Promise<Deal | null>
  delete(id: string): Promise<boolean>
}
