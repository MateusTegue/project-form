import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { BaseAttributes } from '../../services/base'
import { StatusEnum } from '../../enums/EnumEntity'
import type { User } from './user'
import type { CompanyUser } from './companyUser'
import type { Role } from './role'

@Entity('company')
export class Company extends BaseAttributes {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string

  @Column({ type: 'varchar', length: 15, nullable: false, unique: true })
  nit!: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  razonSocial!: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  country!: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  city!: string

  @Column({ type: 'varchar', length: 150, nullable: false })
  address!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl?: string

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status!: StatusEnum

  @ManyToOne(() => require('./role').Role, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role?: Role

  @ManyToOne(() => require('./user').User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  createdBy?: User

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  contactEmail!: string

  @Column({ type: 'varchar', length: 20, nullable: false })
  contactPhone!: string

  @Column({ type: 'varchar', length: 10, nullable: false })
  contactPhoneCountryCode!: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  contactFirstName!: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  contactLastName!: string

  @Column({ type: 'varchar', nullable: false })
  contactPassword!: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  redirectUrl?: string

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  companySlug?: string

  @Column({ type: 'json', nullable: true })
  companyInfo?: {
    title?: string
    description?: string
    content?: string
    contactInfo?: {
      email?: string
      phone?: string
      website?: string
    }
    socialMedia?: {
      facebook?: string
      twitter?: string
      linkedin?: string
      instagram?: string
    }
    [key: string]: any
  }

  // Relación inversa removida para evitar dependencias circulares
  // @OneToMany(() => require('./companyUser').CompanyUser, (cu: CompanyUser) => cu.company)
  // companyUsers!: CompanyUser[]
}

