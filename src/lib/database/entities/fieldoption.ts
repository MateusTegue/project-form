import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import type { FormField } from './formfield'

@Entity('field_option')
export class FieldOption extends BaseAttributes {
  @Column({ type: 'varchar', length: 100, nullable: false })
  label!: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  value!: string

  @Column({ type: 'int', default: 0 })
  displayOrder!: number

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @ManyToOne(() => require('./formfield').FormField, (field: FormField) => field.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formFieldId' })
  field!: FormField
}

