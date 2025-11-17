import {
  type Repository,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  type FindOptionsWhere,
  type FindOptionsSelect,
  type FindOptionsSelectByString,
  type ObjectLiteral,
  type DeepPartial
} from 'typeorm'
import { NotFoundError } from '../helpers/exceptions-errors'

export abstract class BaseAttributes {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}

export interface IService<T extends ObjectLiteral> {
  create: (
    body: DeepPartial<T> | Array<DeepPartial<T>>
  ) => Promise<ObjectLiteral[]>
  getAll: () => Promise<T[]>
  getOne: (
    where: FindOptionsWhere<T>,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined
  ) => Promise<T>
}

export default class Service<T extends ObjectLiteral, R extends Repository<T>>
  implements IService<T>
{
  protected repository: R
  constructor(repository: R) {
    this.repository = repository
  }

  async create(
    body: DeepPartial<T> | Array<DeepPartial<T>>
  ): Promise<ObjectLiteral[]> {
    const data = await this.repository.insert(body as any)
    return data.generatedMaps
  }

  async getAll(
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined = undefined
  ): Promise<T[]> {
    return await this.repository.find({ select: selectOptions })
  }

  async getOne(
    where: FindOptionsWhere<T>,
    message: string,
    selectOptions:
      | FindOptionsSelect<T>
      | FindOptionsSelectByString<T>
      | undefined = undefined
  ): Promise<T> {
    const data = await this.repository.findOne({ where, select: selectOptions })

    if (data === null) {
      throw new NotFoundError(message)
    }
    return data
  }
}

