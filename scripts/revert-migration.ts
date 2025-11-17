import 'reflect-metadata'
import 'dotenv/config'
import { AppDataSource } from '../src/lib/database/data-source'

const revertMigration = async () => {
  try {
    console.log('Initializing database connection...')
    await AppDataSource.initialize()
    console.log('Database connection initialized successfully')

    console.log('Reverting last migration...')
    await AppDataSource.undoLastMigration()
    
    console.log('Migration reverted successfully')

    await AppDataSource.destroy()
    process.exit(0)
  } catch (error) {
    console.error('Error reverting migration:', error)
    process.exit(1)
  }
}

revertMigration()

