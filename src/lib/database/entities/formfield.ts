import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import type { FormModule } from './formodule'
import type { FieldOption } from './fieldoption'
import { FieldTypeEnum } from '../../enums/EnumEntity'

@Entity('formfield')
export class FormField extends BaseAttributes {
  @Column({ type: 'varchar', length: 200, nullable: false })
  label!: string

  @Column({ type: 'varchar', length: 100, nullable: false, unique: false })
  fieldKey!: string

  @Column({
    type: 'enum',
    enum: FieldTypeEnum,
    default: FieldTypeEnum.TEXT
  })
  fieldType!: FieldTypeEnum

  @Column({ type: 'varchar', length: 255, nullable: true })
  placeholder?: string

  @Column({ type: 'text', nullable: true })
  helpText?: string

  @Column({ type: 'boolean', default: false })
  isRequired!: boolean

  @Column({ type: 'int', default: 0 })
  displayOrder!: number

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @Column({ type: 'json', nullable: true })
  validations?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
    fileTypes?: string[]
    maxFileSize?: number
  }

  @Column({ type: 'json', nullable: true })
  layoutConfig?: {
    columnSpan?: number
    width?: string
  }

  @ManyToOne(() => require('./formodule').FormModule, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'formModuleId' })
  module!: FormModule

  // Relación inversa removida para evitar dependencias circulares
  // @OneToMany(() => require('./fieldoption').FieldOption, (option: FieldOption) => option.field, { cascade: true })
  // options!: FieldOption[]
}

