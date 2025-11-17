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
      // Intentar inicializar con manejo de errores de dependencias circulares
      try {
        await AppDataSource.initialize()
      } catch (error: any) {
        // Si el error es de dependencias circulares, intentar una segunda vez
        // después de un breve delay para permitir que los módulos se carguen completamente
        if (error?.message?.includes('Circular relations') || error?.message?.includes('Dependency Cycle')) {
          console.warn('⚠️  Circular dependency detected, retrying initialization...')
          await new Promise(resolve => setTimeout(resolve, 100))
          await AppDataSource.initialize()
        } else {
          throw error
        }
      }
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

