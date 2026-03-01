/**
 * Pagination interfaces for Challenge 3: Pagination and Advanced Filtering
 * Use these types when implementing paginated endpoints.
 */

export interface PaginationOptions {
  page?: number     // Page number (1-indexed), defaults to 1
  limit?: number    // Items per page, defaults to 20
  sortBy?: string   // Field name to sort by
  sortOrder?: 'ASC' | 'DESC'  // Sort direction, defaults to 'ASC'
}

export interface FilterOptions {
  [field: string]: string | number | boolean | undefined
  // TODO [Challenge 5]: Add support for operators (contains, gt, lt, between)
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
