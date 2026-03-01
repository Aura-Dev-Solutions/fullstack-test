import type { Contact, CreateContactDTO, UpdateContactDTO } from './Contact'

export interface ContactRepository {
  // TODO [Challenge 5]: Add PaginationOptions parameter: findAllByOrganization(organizationId: string, options?: PaginationOptions): Promise<PaginatedResult<Contact>>
  findAllByOrganization(organizationId: string): Promise<Contact[]>
  findById(id: string): Promise<Contact | null>
  create(data: CreateContactDTO): Promise<Contact>
  update(id: string, data: UpdateContactDTO): Promise<Contact | null>
  delete(id: string): Promise<boolean>
}
