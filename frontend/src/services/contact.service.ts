import { api, ApiResponse, normalizeApiResponse} from './api'

export interface Contact {
  id: string
  organizationId: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
}

export interface CreateContactDTO {
  name: string
  email?: string
  phone?: string
}

export interface UpdateContactDTO {
  name?: string
  email?: string
  phone?: string
}

export const contactService = {
  getAll: async () =>
    normalizeApiResponse(await api.get<ApiResponse<Contact[]>>("/contacts")),

  getById: async (id: string) =>
    normalizeApiResponse(
      await api.get<ApiResponse<Contact>>(`/contacts/${id}`),
    ),

  create: async (data: CreateContactDTO) =>
    normalizeApiResponse(
      await api.post<ApiResponse<Contact>>("/contacts", data),
    ),

  update: async (id: string, data: UpdateContactDTO) =>
    normalizeApiResponse(
      await api.put<ApiResponse<Contact>>(`/contacts/${id}`, data),
    ),

  delete: (id: string) => api.delete(`/contacts/${id}`),
};
