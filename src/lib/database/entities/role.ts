import { Entity, Column, OneToMany } from 'typeorm'
import type { User } from './user'
import { BaseAttributes } from '../../services/base'
import { RoleEnum } from '../../enums/EnumEntity'
import type { Company } from './company'

@Entity('role')
export class Role extends BaseAttributes {
  @Column({
    type: 'enum',
    enum: RoleEnum,
    unique: true,
  })
  name!: RoleEnum

  // Relación removida temporalmente para evitar dependencias circulares
  // @OneToMany(() => require('./user').User, (user: User) => user.role)
  // users!: User[]

  // Relación removida temporalmente para evitar dependencias circulares
  // @OneToMany(() => require('./company').Company, (company: Company) => company.role)
  // companies!: Company[]
}

