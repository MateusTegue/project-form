import { Entity, Column, OneToMany } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import type { FormField } from './formfield'
import type { FormTemplateModule } from './formTemplateModule'

@Entity('formmodule')
export class FormModule extends BaseAttributes {
  @Column({ type: 'varchar', length: 200, nullable: false })
  name!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  moduleKey!: string

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  // Relaciones inversas removidas para evitar dependencias circulares
  // @OneToMany(() => require('./formfield').FormField, (field: FormField) => field.module, { cascade: true })
  // fields!: FormField[]

  // @OneToMany(() => require('./formTemplateModule').FormTemplateModule, (templateModule: FormTemplateModule) => templateModule.module)
  // templateAssignments!: FormTemplateModule[]
}

