import { DeepPartial } from 'typeorm'
import { AppDataSource } from '../database/data-source'
import { Company } from '../database/entities/company'
import { ConflictError, ServerError, NotFoundError } from '../helpers/exceptions-errors'
import { StatusEnum } from '../enums/EnumEntity'

export const CompanyRepository = AppDataSource.getRepository(Company).extend({
  findByEmailOrUsername: async function (identifier: string): Promise<Company | null> {
    return this.createQueryBuilder('company')
      .leftJoinAndSelect('company.role', 'role')
      .where('LOWER(company.contactEmail) = LOWER(:identifier)', { identifier })
      .getOne()
  },

  async createCompany(body: DeepPartial<Company>) {
    try {
      const existing = await this.findOne({
        where: [{ nit: body.nit }, { contactEmail: body.contactEmail }],
      })

      if (existing) {
        throw new ConflictError(
          `Ya existe una empresa con este NIT o correo de contacto`
        )
      }

      const company = this.create(body)
      return await this.save(company)
    } catch (error) {
      throw new ServerError('Error al crear la compañía', { cause: error })
    }
  },

  getCompanyBySlug: async function (slug: string): Promise<Company | null> {
    return await this.findOne({ 
      where: { companySlug: slug },
      relations: ['role']
    })
  },

  getCompanyById: async function (id: string): Promise<Company | null> {
    return await this.findOne({ 
      where: { id },
      relations: ['role', 'createdBy']
    })
  },

  activateCompanyById: async function (id: string): Promise<void> {
    const result = await this.update({ id }, { status: StatusEnum.ACTIVE })
    
    if (result.affected === 0) {
      throw new NotFoundError('Company not found')
    }
  },

  getAllCompaniesByStatus: async function (status: StatusEnum): Promise<Company[]> {
    const companies = await this.find({
      where: { status },
      order: { created_at: 'DESC' },
    })

    if (companies.length === 0) {
      throw new NotFoundError('No companies found with the specified status')
    }

    return companies
  },

  countActiveCompanies: async function (): Promise<number> {
    const count = await this.count({
      where: { status: StatusEnum.ACTIVE },
    })
    return count
  },
})

