import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import UserService from '@/lib/services/user.service'
import { UserRepository } from '@/lib/repositories/user.repository'
import { z } from 'zod'

const createUserSchema = z.object({
  firstName: z.string().min(1),
  secondName: z.string().optional(),
  firstMiddleName: z.string().min(1),
  secondMiddleName: z.string().optional(),
  email: z.string().email(),
  codePhone: z.string().min(1),
  phone: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(6),
  roleId: z.string().uuid(),
})

export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const users = await UserRepository.find({
      relations: ['role'],
      order: { created_at: 'DESC' }
    } as any)

    return formatResponse(users, 'Users retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const body = await req.json()
    const validatedData = createUserSchema.parse(body)

    const userService = new UserService()
    const user = await userService.createUser(validatedData)

    return formatResponse(user, 'User created successfully', 201)
  } catch (error) {
    return formatError(error)
  }
}