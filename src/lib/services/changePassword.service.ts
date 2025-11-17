import { UserRepository } from '../repositories/user.repository'
import { CompanyRepository } from '../repositories/company.repository'
import { hashPassword } from '../utils/bcrypt'
import { NotFoundError, BadRequestError } from '../helpers/exceptions-errors'
import OtpService from './otp.service'
import { OtpTypeEnum } from '../enums/EnumEntity'

class ChangePasswordService {
  private otpService: OtpService

  constructor() {
    this.otpService = new OtpService()
  }

  public async changePassword(
    contactEmail: string,
    otpCode: string,
    newPassword: string
  ): Promise<void> {
    const otpValidation = await this.otpService.validateOtp(
      contactEmail,
      otpCode,
      OtpTypeEnum.RESET_PASSWORD
    )

    if (!otpValidation.valid || !otpValidation.userId) {
      throw new BadRequestError('Código OTP inválido o expirado')
    }

    const user = await UserRepository.findOne({
      where: { id: otpValidation.userId },
    })

    if (!user) {
      throw new NotFoundError('Usuario no encontrado')
    }

    if (user.email.toLowerCase() !== contactEmail.toLowerCase()) {
      throw new BadRequestError('El email no coincide con el usuario')
    }

    const hashedPassword = await hashPassword(newPassword)

    await UserRepository.update(user.id, {
      password: hashedPassword,
    })
  }

  public async changeCompanyPassword(
    contactEmail: string,
    otpCode: string,
    newPassword: string
  ): Promise<void> {
    const otpValidation = await this.otpService.validateOtp(
      contactEmail,
      otpCode,
      OtpTypeEnum.RESET_PASSWORD
    )

    if (!otpValidation.valid) {
      throw new BadRequestError('Código OTP inválido o expirado')
    }

    const company = await CompanyRepository.findOne({
      where: { contactEmail },
    })

    if (!company) {
      throw new NotFoundError('Empresa no encontrada')
    }

    if (company.contactEmail.toLowerCase() !== contactEmail.toLowerCase()) {
      throw new BadRequestError('El email no coincide con la empresa')
    }

    const hashedPassword = await hashPassword(newPassword)

    await CompanyRepository.update(company.id, {
      contactPassword: hashedPassword,
    })
  }
}

export default ChangePasswordService

