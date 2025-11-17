import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import type { FormSubmission } from './formsubmission'
import type { FormField } from './formfield'

@Entity('submission_answer')
export class SubmissionAnswer extends BaseAttributes {
  @ManyToOne(() => require('./formsubmission').FormSubmission, (submission: FormSubmission) => submission.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formSubmissionId' })
  submission!: FormSubmission

  @ManyToOne(() => require('./formfield').FormField, { nullable: false })
  @JoinColumn({ name: 'formFieldId' })
  field!: FormField

  @Column({ type: 'varchar', length: 100, nullable: false })
  fieldKey!: string

  @Column({ type: 'text', nullable: true })
  textValue?: string

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  numberValue?: number

  @Column({ type: 'date', nullable: true })
  dateValue?: Date

  @Column({ type: 'json', nullable: true })
  jsonValue?: any

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileUrl?: string
}

