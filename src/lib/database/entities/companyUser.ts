import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm'
import type { User } from './user'
import type { Company } from './company'
import { RoleEnum } from '../../enums/EnumEntity'
import { BaseAttributes } from '../../services/base'

@Entity('company_user')
export class CompanyUser extends BaseAttributes {
  @ManyToOne(() => require('./company').Company, (company: Company) => company.companyUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: Company

  @ManyToOne(() => require('./user').User, (user: User) => user.companyUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User

  @Column({
    type: 'enum',
    enum: RoleEnum,
  })
  role!: RoleEnum

  @Column({ type: 'boolean', default: true })
  enabled!: boolean
}

