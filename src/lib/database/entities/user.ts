import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import { StatusEnum } from '../../enums/EnumEntity'
import type { Role } from './role'
import type { Otp } from './otp'
import type { CompanyUser } from './companyUser'

@Entity('user')
export class User extends BaseAttributes {
  @Column({ nullable: false })
  firstName!: string

  @Column({ nullable: true })
  secondName?: string

  @Column({ nullable: false })
  firstMiddleName!: string

  @Column({ nullable: true })
  secondMiddleName?: string

  @Column({ unique: true, nullable: false })
  email!: string

  @Column({ nullable: false })
  codePhone!: string

  @Column({ unique: true, nullable: false })
  phone!: string

  @Column({ unique: true, nullable: false })
  username!: string

  @Column({ nullable: false })
  password!: string

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status!: StatusEnum

  @ManyToOne(() => require('./role').Role, (role: Role) => role.users, { eager: false })
  @JoinColumn({ name: 'roleId' })
  role!: Role

  @OneToMany(() => require('./otp').Otp, (otp: Otp) => otp.user)
  otps!: Otp[]

  @OneToMany(() => require('./companyUser').CompanyUser, (cu: CompanyUser) => cu.user)
  companyUsers!: CompanyUser[]
}

