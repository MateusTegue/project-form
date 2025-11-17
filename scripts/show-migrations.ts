import 'reflect-metadata'
import 'dotenv/config'
import { AppDataSource } from '../src/lib/database/data-source'

const showMigrations = async () => {
  try {
    console.log('Initializing database connection...')
    await AppDataSource.initialize()
    console.log('Database connection initialized successfully')

    console.log('Checking migration status...')
    
    // showMigrations() retorna un boolean indicando si hay migraciones pendientes
    const hasPendingMigrations = await AppDataSource.showMigrations()
    
    if (!hasPendingMigrations) {
      console.log('No pending migrations. Database is up to date.')
    } else {
      // Para obtener la lista de migraciones pendientes, necesitamos comparar
      // las migraciones definidas con las ejecutadas
      const allMigrations = AppDataSource.migrations || []
      const queryRunner = AppDataSource.createQueryRunner()
      
      // Obtener las migraciones ya ejecutadas desde la base de datos
      let executedMigrations: string[] = []
      try {
        const migrationsTable = AppDataSource.options.migrationsTableName || 'migrations'
        const result = await queryRunner.query(
          `SELECT name FROM ${migrationsTable} ORDER BY timestamp DESC`
        )
        executedMigrations = result.map((row: any) => row.name)
      } catch (error: any) {
        // Si la tabla no existe, no hay migraciones ejecutadas
        if (error.code !== '42P01') { // 42P01 = table does not exist
          throw error
        }
      } finally {
        await queryRunner.release()
      }
      
      // Encontrar las migraciones pendientes
      const pendingMigrations = allMigrations.filter(
        (migration): migration is typeof migration & { name: string } => 
          migration.name !== undefined && !executedMigrations.includes(migration.name)
      )
      
      if (pendingMigrations.length === 0) {
        console.log('No pending migrations. Database is up to date.')
      } else {
        console.log(`Found ${pendingMigrations.length} pending migration(s):`)
        pendingMigrations.forEach((migration) => {
          console.log(`  - ${migration.name}`)
        })
      }
    }

    await AppDataSource.destroy()
    process.exit(0)
  } catch (error) {
    console.error('Error checking migrations:', error)
    process.exit(1)
  }
}

showMigrations()

