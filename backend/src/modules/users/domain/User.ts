export interface User {
  id: string
  name: string
  email: string
  role?: UserRole
  createdAt: Date
}

export interface CreateUserDTO {
  name: string
  email: string
}

export type UserRole = 'admin' | 'member' // TODO [Challenge 6]: Extend with additional roles as needed
