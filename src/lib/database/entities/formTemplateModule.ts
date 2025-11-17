import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import type { FormTemplate } from './formtemplate'
import type { FormModule } from './formodule'

@Entity('formtemplatemodule')
export class FormTemplateModule extends BaseAttributes {
  @ManyToOne(() => require('./formtemplate').FormTemplate, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'templateId' })
  template!: FormTemplate

  @ManyToOne(() => require('./formodule').FormModule, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'moduleId' })
  module!: FormModule

  @Column({ type: 'int', default: 0 })
  displayOrder!: number

  @Column({ type: 'boolean', default: true })
  isRequired!: boolean

  @Column({ type: 'boolean', default: true })
  isActive!: boolean
}

