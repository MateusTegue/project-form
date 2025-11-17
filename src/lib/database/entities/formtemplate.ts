import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import { StatusEnum, FormTemplateTypeEnum } from '../../enums/EnumEntity'
import type { User } from './user'
import type { CompanyFormAssignment } from './companyformassignment'
import type { FormTemplateModule } from './formTemplateModule'

@Entity('formtemplate')
export class FormTemplate extends BaseAttributes {
  @Column({ type: 'varchar', length: 200, nullable: false })
  name!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({
    type: 'enum',
    enum: FormTemplateTypeEnum,
    default: FormTemplateTypeEnum.TERCERO_GENERAL
  })
  templateType!: FormTemplateTypeEnum

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status!: StatusEnum

  @ManyToOne(() => require('./user').User, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User

  @OneToMany(() => require('./formTemplateModule').FormTemplateModule, (templateModule: FormTemplateModule) => templateModule.template, { cascade: true })
  moduleAssignments!: FormTemplateModule[]

  @OneToMany(() => require('./companyformassignment').CompanyFormAssignment, (assignment: CompanyFormAssignment) => assignment.formTemplate)
  companyAssignments!: CompanyFormAssignment[]
}

