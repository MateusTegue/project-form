import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import type { CompanyFormAssignment } from './companyformassignment'
import type { SubmissionAnswer } from './submissionanswer'
import { SubmissionStatusEnum } from '../../enums/EnumEntity'

@Entity('form_submission')
export class FormSubmission extends BaseAttributes {
  @ManyToOne(() => require('./companyformassignment').CompanyFormAssignment, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'companyFormAssignmentId' })
  companyFormAssignment!: CompanyFormAssignment

  @Column({ type: 'varchar', length: 100, nullable: true })
  submitterEmail?: string

  @Column({ type: 'varchar', length: 200, nullable: true })
  submitterName?: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  submitterPhone?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  submitterDocumentId?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string

  @Column({ type: 'text', nullable: true })
  userAgent?: string

  @Column({
    type: 'enum',
    enum: SubmissionStatusEnum,
    default: SubmissionStatusEnum.EARRING,
  })
  status!: SubmissionStatusEnum

  @Column({ type: 'text', nullable: true })
  reviewNotes?: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  reviewedBy?: string

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date

  // Relación inversa removida para evitar dependencias circulares
  // @OneToMany(() => require('./submissionanswer').SubmissionAnswer, (answer: SubmissionAnswer) => answer.submission, { cascade: true })
  // answers!: SubmissionAnswer[]
}

