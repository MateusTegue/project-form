import { AppDataSource } from './data-source'

/**
 * Obtiene la información de la base de datos para logging
 */
function getDatabaseInfo() {
  const databaseUrl = process.env.DATABASE_URL

  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl)
      return {
        database: url.pathname.replace(/^\//, ''),
        host: url.hostname,
        port: url.port || '5432'
      }
    } catch (error) {
      // Si falla el parseo, usar variables individuales
    }
  }

  // Fallback a variables individuales
  return {
    database: process.env.DB_NAME || 'unknown',
    host: process.env.DB_HOST || 'unknown',
    port: process.env.DB_PORT || '5432'
  }
}

export const initDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      const dbInfo = getDatabaseInfo()
      console.log('✅ Database connected successfully')
      console.log(`📊 Database: ${dbInfo.database}`)
      console.log(`🔌 Host: ${dbInfo.host}:${dbInfo.port}`)
    } else {
      console.log('✅ Database already connected')
    }
  } catch (e) {
    console.error('❌ Database connection error:', e)
    throw e
  }
}

export default AppDataSource

