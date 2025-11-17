import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import { StatusEnum } from '../../enums/EnumEntity'
import type { Company } from './company'
import type { FormTemplate } from './formtemplate'
import type { FormSubmission } from './formsubmission'

@Entity('companyformassignment')
export class CompanyFormAssignment extends BaseAttributes {
  @ManyToOne('Company', { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company?: Company

  @ManyToOne('FormTemplate', { nullable: true })
  @JoinColumn({ name: 'formTemplateId' })
  formTemplate?: FormTemplate

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  publicToken!: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  publicUrl?: string

  @Column({ type: 'boolean', default: true })
  isActive!: boolean

  @Column({ type: 'boolean', default: false })
  allowMultipleSubmissions!: boolean

  @Column({ type: 'boolean', default: false })
  allowEditAfterSubmit!: boolean

  @Column({ type: 'timestamp', nullable: true })
  activatedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status!: StatusEnum

  @Column({ type: 'json', nullable: true })
  customConfig?: {
    welcomeMessage?: string
    successMessage?: string
    companyLogo?: string
    primaryColor?: string
  }

  // Relación inversa removida para evitar dependencias circulares
  // @OneToMany(() => require('./formsubmission').FormSubmission, (submission: FormSubmission) => submission.companyFormAssignment)
  // submissions!: FormSubmission[]
}

