// NOTE: This config helper is not currently used — AppDataSource in data-source.ts reads env vars directly.
// Kept as a utility for scripts or future use outside of TypeORM.
export interface DatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'fullstack_db',
  }
}
