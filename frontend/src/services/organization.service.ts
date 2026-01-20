import { api, ApiResponse, normalizeApiResponse } from './api'

export interface Organization {
  id: string
  name: string
  createdAt: string
}

export const organizationService = {
  get: async () =>
    normalizeApiResponse(
      await api.get<ApiResponse<Organization>>("/organizations"),
    ),

  update: async (data: { name?: string }) =>
    normalizeApiResponse(
      await api.put<ApiResponse<Organization>>("/organizations", data),
    ),
};
