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

const config: ConfigDataBase = {
  production: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    ssl:
      process.env.DB_ROOT_CA === undefined
        ? false
        : {
            ca: process.env.DB_ROOT_CA
          },
    logging: false,
    entities,
    ...(isNextJsRuntime ? {} : { migrations: ['src/lib/database/migrations/*{.ts,.js}'] }),
    migrationsTableName: 'migrations',
    subscribers: []
  },
  local: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: ['error'],
    ssl: process.env.DB_SSL === 'true'
      ? { ca: process.env.DB_ROOT_CA }
      : false,
    entities,
    ...(isNextJsRuntime ? {} : { migrations: ['src/lib/database/migrations/*{.ts,.js}'] }),
    migrationsTableName: 'migrations',
    subscribers: [],
    maxQueryExecutionTime: 1000,
  }
}

export default config

