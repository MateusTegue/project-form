import { Entity, Column, ManyToOne } from 'typeorm'
import type { User } from './user'
import { BaseAttributes } from '../../services/base'
import { StatusEnum, OtpTypeEnum } from '../../enums/EnumEntity'

@Entity('otp')
export class Otp extends BaseAttributes {
  @Column()
  contactEmail!: string

  @Column({ type: 'varchar', length: 6, nullable: false })
  code!: string

  @Column({
    type: 'enum',
    enum: OtpTypeEnum,
  })
  type!: OtpTypeEnum

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE
  })
  status!: StatusEnum

  @Column()
  expirationDate!: Date

  @ManyToOne('User', { nullable: true, onDelete: 'CASCADE' })
  user?: User
}

