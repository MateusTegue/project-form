import 'reflect-metadata'
import { readFileSync } from 'fs'
import { join } from 'path'
import { AppDataSource } from '../src/lib/database/data-source'
import { FormField } from '../src/lib/database/entities/formfield'
import { FieldOption } from '../src/lib/database/entities/fieldoption'
import { FieldTypeEnum } from '../src/lib/enums/EnumEntity'

const modulesAndFieldsData = JSON.parse(
  readFileSync(join(__dirname, '../src/data/modules-and-fields.json'), 'utf-8')
)

interface FieldDefinition {
  fieldKey: string
  fieldType: string
  options?: Array<{
    label: string
    value: string
    displayOrder: number
    isActive: boolean
  }>
}

async function updateFieldOptions() {
  try {
    console.log('🔄 Inicializando conexión a la base de datos...')
    await AppDataSource.initialize()
    console.log('✅ Base de datos conectada')

    // Crear un mapa de opciones por fieldKey desde el JSON
    const optionsMap = new Map<string, FieldDefinition['options']>()
    
    for (const module of modulesAndFieldsData.modules) {
      for (const field of module.fields) {
        if (field.fieldType === 'SELECT' && field.options && field.options.length > 0) {
          optionsMap.set(field.fieldKey, field.options)
        }
      }
    }

    console.log(`📋 Encontradas ${optionsMap.size} definiciones de campos SELECT con opciones en el JSON`)

    // Buscar todos los campos SELECT en la base de datos
    const selectFields = await AppDataSource.getRepository(FormField).find({
      where: { fieldType: FieldTypeEnum.SELECT }
    })

    console.log(`🔍 Encontrados ${selectFields.length} campos SELECT en la base de datos`)

    // Obtener todas las opciones existentes agrupadas por fieldId
    const fieldOptionRepository = AppDataSource.getRepository(FieldOption)
    const allOptions = await fieldOptionRepository
      .createQueryBuilder('option')
      .leftJoinAndSelect('option.field', 'field')
      .getMany()
    
    const optionsByFieldId = new Map<string, FieldOption[]>()
    
    for (const option of allOptions) {
      // Obtener el fieldId de la relación o de la columna directamente
      const fieldId = option.field?.id || (option as any).formFieldId
      if (fieldId) {
        if (!optionsByFieldId.has(fieldId)) {
          optionsByFieldId.set(fieldId, [])
        }
        optionsByFieldId.get(fieldId)!.push(option)
      }
    }

    let updatedCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (const field of selectFields) {
      // Obtener opciones existentes para este campo
      const existingOptions = optionsByFieldId.get(field.id) || []
      const existingOptionsCount = existingOptions.length
      const jsonOptions = optionsMap.get(field.fieldKey)

      if (!jsonOptions || jsonOptions.length === 0) {
        console.log(`⚠️  Campo "${field.label}" (${field.fieldKey}) no tiene opciones en el JSON, omitiendo...`)
        skippedCount++
        continue
      }

      if (existingOptionsCount > 0) {
        console.log(`ℹ️  Campo "${field.label}" (${field.fieldKey}) ya tiene ${existingOptionsCount} opciones, omitiendo...`)
        skippedCount++
        continue
      }

      try {
        console.log(`📝 Actualizando campo "${field.label}" (${field.fieldKey}) con ${jsonOptions.length} opciones...`)

        // Crear las opciones
        const options = jsonOptions.map((opt) =>
          AppDataSource.getRepository(FieldOption).create({
            label: opt.label,
            value: opt.value,
            displayOrder: opt.displayOrder ?? 0,
            isActive: opt.isActive ?? true,
            field: field
          })
        )

        await AppDataSource.getRepository(FieldOption).save(options)
        updatedCount++
        console.log(`✅ Campo "${field.label}" actualizado correctamente`)
      } catch (error: any) {
        console.error(`❌ Error al actualizar campo "${field.label}" (${field.fieldKey}):`, error.message)
        errorCount++
      }
    }

    console.log('\n📊 Resumen:')
    console.log(`   ✅ Campos actualizados: ${updatedCount}`)
    console.log(`   ⏭️  Campos omitidos: ${skippedCount}`)
    console.log(`   ❌ Errores: ${errorCount}`)

    await AppDataSource.destroy()
    console.log('✅ Proceso completado')
  } catch (error: any) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

updateFieldOptions()

