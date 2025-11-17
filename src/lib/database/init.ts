import 'reflect-metadata'
import { initDatabase } from './connection'

let isInitialized = false

export const ensureDatabaseInitialized = async (): Promise<void> => {
  if (isInitialized) {
    return
  }

  try {
    await initDatabase()
    isInitialized = true
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

