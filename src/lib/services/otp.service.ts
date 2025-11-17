import Service from './base'
import { OtpRepository } from '../repositories/otp.repository'
import { Otp } from '../database/entities/otp'
import { OtpTypeEnum } from '../enums/EnumEntity'
import { UserRepository } from '../repositories/user.repository'
import { CompanyRepository } from '../repositories/company.repository'
import { NotFoundError, BadRequestError } from '../helpers/exceptions-errors'

class OtpService extends Service<Otp, typeof OtpRepository> {
  constructor() {
    super(OtpRepository)
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  public async generateOtp(
    contactEmail: string,
    type: OtpTypeEnum
  ): Promise<{ code: string; expiresAt: Date }> {
    let userId: string | null = null
    const user = await UserRepository.findOne({
      where: { email: contactEmail },
    })

    if (user) {
      userId = user.id
    } else {
      const company = await CompanyRepository.findOne({
        where: { contactEmail },
        relations: ['createdBy'],
      })

      if (!company) {
        throw new NotFoundError('Usuario o empresa no encontrado con ese email')
      }

      if (company.createdBy) {
        userId = company.createdBy.id
      } else {
        const adminUser = await UserRepository.findOne({
          where: {},
        })

        if (!adminUser) {
          throw new BadRequestError('No se pudo generar el código OTP. Contacta al administrador.')
        }

        userId = adminUser.id
      }
    }

    if (!userId) {
      throw new NotFoundError('Usuario no encontrado')
    }

    const code = this.generateOtpCode()
    const expirationDate = new Date()
    expirationDate.setMinutes(expirationDate.getMinutes() + 10)

    await this.repository.createOtp({
      contactEmail,
      code,
      type,
      userId,
      expirationDate,
    })

    return {
      code,
      expiresAt: expirationDate,
    }
  }

  public async validateOtp(
    contactEmail: string,
    code: string,
    type: OtpTypeEnum
  ): Promise<{ valid: boolean; userId?: string; email?: string }> {
    const otp = await this.repository.findValidOtp(contactEmail, code, type)

    if (!otp) {
      return { valid: false }
    }

    if (new Date() > otp.expirationDate) {
      await this.repository.invalidateOtp(otp.id)
      return { valid: false }
    }

    await this.repository.invalidateOtp(otp.id)

    return {
      valid: true,
      userId: otp.user?.id,
      email: otp.contactEmail,
    }
  }
}

export default OtpService

