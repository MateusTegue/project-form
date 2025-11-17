import { AppDataSource } from '../database/data-source'
import { Otp } from '../database/entities/otp'
import { OtpTypeEnum, StatusEnum } from '../enums/EnumEntity'

export const OtpRepository = AppDataSource.getRepository(Otp).extend({
  async createOtp(data: {
    contactEmail: string
    code: string
    type: OtpTypeEnum
    userId: string
    expirationDate: Date
  }): Promise<Otp> {
    await this.createQueryBuilder()
      .update(Otp)
      .set({ status: StatusEnum.INACTIVE })
      .where('contactEmail = :contactEmail', { contactEmail: data.contactEmail })
      .andWhere('type = :type', { type: data.type })
      .andWhere('status = :status', { status: StatusEnum.ACTIVE })
      .execute()

    const otp = this.create({
      contactEmail: data.contactEmail,
      code: data.code,
      type: data.type,
      user: { id: data.userId },
      expirationDate: data.expirationDate,
      status: StatusEnum.ACTIVE,
    })

    return await this.save(otp)
  },

  async findValidOtp(
    contactEmail: string,
    code: string,
    type: OtpTypeEnum
  ): Promise<Otp | null> {
    return await this.findOne({
      where: {
        contactEmail,
        code,
        type,
        status: StatusEnum.ACTIVE,
      },
      relations: ['user'],
    })
  },

  async invalidateOtp(otpId: string): Promise<void> {
    await this.update({ id: otpId }, { status: StatusEnum.INACTIVE })
  },
})

