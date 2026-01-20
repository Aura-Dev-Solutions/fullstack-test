import { z } from 'zod'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function getFormErrors<T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  data: T
): FieldErrors<T> {
  const result = schema.safeParse(data)
  if (result.success) {
    return {}
  }

  return result.error.issues.reduce((acc, issue) => {
    const field = issue.path[0]
    if (typeof field === 'string' && !(field in acc)) {
      acc[field as keyof T] = issue.message
    }
    return acc
  }, {} as FieldErrors<T>)
}