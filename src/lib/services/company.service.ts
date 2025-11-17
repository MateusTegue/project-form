import Service from './base'
import { Company } from '../database/entities/company'
import { CompanyRepository } from '../repositories/company.repository'
import { NotFoundError } from '../helpers/exceptions-errors'
import { StatusEnum } from '../enums/EnumEntity'
import { hashPassword } from '../utils/bcrypt'
import { generateSlug } from '../utils/slug'

interface UpdateCompanyData {
  name?: string
  nit?: string
  razonSocial?: string
  country?: string
  city?: string
  address?: string
  logoUrl?: string
  roleId?: string
  contactEmail?: string
  contactPhone?: string
  contactPhoneCountryCode?: string
  contactFirstName?: string
  contactLastName?: string
  contactPassword?: string
  redirectUrl?: string | null
  companyInfo?: any
  createdBy?: string
}

class CompanyService extends Service<Company, typeof CompanyRepository> {
  constructor() {
    super(CompanyRepository)
  }

  public async getCompanyById(id: string): Promise<Company | null> {
    return await this.repository.getCompanyById(id)
  }

  public async updateCompany(id: string, data: Partial<UpdateCompanyData>): Promise<Company> {
    const currentCompany = await this.repository.findOneBy({ id })
    if (!currentCompany) {
      throw new NotFoundError('Company not found')
    }

    const updateData: any = {
      ...data,
      createdBy: data.createdBy ? { id: data.createdBy } : undefined
    }

    let finalSlug = currentCompany.companySlug
    const companyName = data.name || currentCompany.name
    
    if (!finalSlug || (data.name && data.name !== currentCompany.name)) {
      const newSlug = generateSlug(companyName)
      finalSlug = newSlug
      let counter = 1
      
      while (true) {
        const existing = await this.repository.findOne({ 
          where: { companySlug: finalSlug }
        })
        
        if (!existing || existing.id === id) {
          break
        }
        
        finalSlug = `${newSlug}-${counter}`
        counter++
      }
      
      updateData.companySlug = finalSlug
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      updateData.redirectUrl = `${baseUrl}/company/${finalSlug}`
    } else if (!currentCompany.redirectUrl) {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      updateData.redirectUrl = `${baseUrl}/company/${finalSlug}`
    } else if (data.redirectUrl && data.redirectUrl.trim() !== '') {
      updateData.redirectUrl = data.redirectUrl.trim()
    }
    
    if (!updateData.companySlug && !currentCompany.companySlug) {
      const newSlug = generateSlug(companyName)
      let finalSlugAuto = newSlug
      let counter = 1
      
      while (true) {
        const existing = await this.repository.findOne({ 
          where: { companySlug: finalSlugAuto }
        })
        
        if (!existing || existing.id === id) {
          break
        }
        
        finalSlugAuto = `${newSlug}-${counter}`
        counter++
      }
      
      updateData.companySlug = finalSlugAuto
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      updateData.redirectUrl = `${baseUrl}/company/${finalSlugAuto}`
    }

    if ('redirectUrl' in data) {
      if (data.redirectUrl === null || data.redirectUrl === undefined || data.redirectUrl.trim() === '') {
        const slug = updateData.companySlug || currentCompany.companySlug
        if (slug) {
          const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
          updateData.redirectUrl = `${baseUrl}/company/${slug}`
        } else {
          updateData.redirectUrl = undefined
        }
      } else {
        updateData.redirectUrl = data.redirectUrl.trim()
      }
    }

    if ('companyInfo' in data) {
      if (data.companyInfo === null || data.companyInfo === undefined) {
        updateData.companyInfo = undefined
      } else {
        updateData.companyInfo = data.companyInfo
      }
    }

    await this.repository.update(id, updateData)

    if (data.contactPassword) {
      const hashedPassword = await hashPassword(data.contactPassword)
      const passwordUpdateData: any = {
        ...data,
        createdBy: data.createdBy ? { id: data.createdBy } : undefined,
        contactPassword: hashedPassword
      }

      if ('redirectUrl' in updateData) {
        passwordUpdateData.redirectUrl = updateData.redirectUrl
      }
      if ('companySlug' in updateData) {
        passwordUpdateData.companySlug = updateData.companySlug
      }
      if ('companyInfo' in updateData) {
        passwordUpdateData.companyInfo = updateData.companyInfo
      }

      await this.repository.update(id, passwordUpdateData)
    }
    
    const updatedCompany = await this.repository.findOneBy({ id })

    if (updatedCompany === null) throw new NotFoundError('Company not found')

    return updatedCompany
  }

  public async deleteCompany(id: string): Promise<void> {
    const company = await this.repository.findOneBy({ id })

    if (company === null) throw new NotFoundError('Company not found')

    company.status = StatusEnum.INACTIVE

    await this.repository.save(company)
  }

  public async activeCompany(id: string): Promise<void> {
    await this.repository.activateCompanyById(id)
  }
}

export default CompanyService

