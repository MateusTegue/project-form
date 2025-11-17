import { AppDataSource } from './data-source'

export const initDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      console.log('✅ Database connected successfully')
      console.log(`📊 Database: ${process.env.DB_NAME}`)
      console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)
    } else {
      console.log('✅ Database already connected')
    }
  } catch (e) {
    console.error('❌ Database connection error:', e)
    throw e
  }
}

export default AppDataSource

