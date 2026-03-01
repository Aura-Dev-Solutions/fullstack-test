/**
 * Pagination types for Challenge 3: Pagination and Advanced Filtering
 * These mirror the backend's Pagination interfaces.
 */

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
