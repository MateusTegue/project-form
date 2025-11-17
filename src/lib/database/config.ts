import 'dotenv/config'
import { type DataSourceOptions } from 'typeorm'
import {
  Role,
  User,
  Company,
  CompanyUser,
  Otp,
  FormModule,
  FormField,
  FieldOption,
  FormTemplate,
  FormTemplateModule,
  CompanyFormAssignment,
  FormSubmission,
  SubmissionAnswer
} from './entities'

interface ConfigDataBase {
  production: DataSourceOptions
  local: DataSourceOptions
}

export type ConfigEnv = keyof ConfigDataBase

const entities = [
  Role,
  User,
  Company,
  CompanyUser,
  Otp,
  FormModule,
  FormField,
  FieldOption,
  FormTemplate,
  FormTemplateModule,
  CompanyFormAssignment,
  FormSubmission,
  SubmissionAnswer
]

// Solo incluir migraciones si no estamos en Next.js runtime
const isNextJsRuntime = typeof process !== 'undefined' && process.env.NEXT_RUNTIME

/**
 * Parsea DATABASE_URL o usa variables individuales
 * Formato DATABASE_URL: postgresql://user:password@host:port/database?sslmode=require
 */
function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL

  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl)
      
      // Extraer parámetros SSL de la URL
      const sslMode = url.searchParams.get('sslmode')
      const sslConfig = sslMode === 'require' || sslMode === 'prefer'
        ? (process.env.DB_ROOT_CA ? { ca: process.env.DB_ROOT_CA } : true)
        : false

      return {
        host: url.hostname,
        port: Number(url.port) || 5432,
        username: url.username,
        password: url.password,
        database: url.pathname.replace(/^\//, ''), // Remover el / inicial
        ssl: sslConfig
      }
    } catch (error) {
      console.warn('Error parsing DATABASE_URL, falling back to individual variables:', error)
    }
  }

  // Fallback a variables individuales
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: process.env.DB_ROOT_CA
      ? { ca: process.env.DB_ROOT_CA }
      : (process.env.DB_SSL === 'true' ? true : false)
  }
}

const dbConfig = getDatabaseConfig()

const config: ConfigDataBase = {
  production: {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: false,
    ssl: dbConfig.ssl,
    logging: false,
    entities,
    ...(isNextJsRuntime ? {} : { migrations: ['src/lib/database/migrations/*{.ts,.js}'] }),
    migrationsTableName: 'migrations',
    subscribers: [],
    relationLoadStrategy: 'query', // Usar estrategia de carga por consulta para evitar problemas con relaciones circulares
  },
  local: {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: false,
    logging: ['error'],
    ssl: dbConfig.ssl,
    entities,
    ...(isNextJsRuntime ? {} : { migrations: ['src/lib/database/migrations/*{.ts,.js}'] }),
    migrationsTableName: 'migrations',
    subscribers: [],
    maxQueryExecutionTime: 1000,
    relationLoadStrategy: 'query', // Usar estrategia de carga por consulta para evitar problemas con relaciones circulares
  }
}

export default config

