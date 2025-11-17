import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import UserService from '@/lib/services/user.service'
import { UserRepository } from '@/lib/repositories/user.repository'
import { Role } from '@/lib/database/entities/role'
import { AppDataSource } from '@/lib/database/data-source'
import { RoleEnum } from '@/lib/enums/EnumEntity'
import { z } from 'zod'
import { PermissionDeniedError } from '@/lib/helpers/exceptions-errors'

const createAdminSchema = z.object({
  firstName: z.string().min(1),
  secondName: z.string().optional(),
  firstMiddleName: z.string().min(1),
  secondMiddleName: z.string().optional(),
  email: z.string().email(),
  codePhone: z.string().min(1),
  phone: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(6),
  roleName: z.enum(['SUPER_ADMIN', 'ADMIN_ALIADO']).optional().default('SUPER_ADMIN'),
})

/**
 * Ruta pública para crear el primer administrador
 * Solo funciona si no existe ningún usuario con rol SUPER_ADMIN o ADMIN_ALIADO
 */
export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    // Verificar si ya existen administradores en la tabla user de la aplicación
    // Buscar usuarios que tengan email (usuarios de la aplicación, no del sistema)
    // y que tengan rol de administrador
    const roleRepository = AppDataSource.getRepository(Role)
    
    // Buscar los roles de administrador
    const superAdminRole = await roleRepository.findOne({ where: { name: RoleEnum.SUPER_ADMIN } })
    const adminAliadoRole = await roleRepository.findOne({ where: { name: RoleEnum.ADMIN_ALIADO } })
    
    let adminCount = 0
    
    // Contar usuarios con rol SUPER_ADMIN que tengan email (usuarios de la aplicación)
    if (superAdminRole) {
      const superAdmins = await UserRepository.find({
        where: { role: { id: superAdminRole.id } },
        relations: ['role']
      } as any)
      // Filtrar solo usuarios con email válido (excluir usuarios del sistema)
      const validSuperAdmins = superAdmins.filter((user: any) => 
        user.email && 
        user.email.includes('@') && 
        !user.email.includes('neondb') &&
        !user.email.includes('postgres')
      )
      adminCount += validSuperAdmins.length
    }
    
    // Contar usuarios con rol ADMIN_ALIADO que tengan email (usuarios de la aplicación)
    if (adminAliadoRole) {
      const adminAliados = await UserRepository.find({
        where: { role: { id: adminAliadoRole.id } },
        relations: ['role']
      } as any)
      // Filtrar solo usuarios con email válido (excluir usuarios del sistema)
      const validAdminAliados = adminAliados.filter((user: any) => 
        user.email && 
        user.email.includes('@') && 
        !user.email.includes('neondb') &&
        !user.email.includes('postgres')
      )
      adminCount += validAdminAliados.length
    }

    if (adminCount > 0) {
      return formatError(new PermissionDeniedError('Ya existen administradores en el sistema. Esta ruta solo está disponible para crear el primer administrador.'))
    }

    const body = await req.json()
    const validatedData = createAdminSchema.parse(body)

    // Buscar o crear el rol
    let role = await roleRepository.findOne({
      where: { name: validatedData.roleName as RoleEnum }
    })

    if (!role) {
      // Si el rol no existe, crearlo
      role = roleRepository.create({
        name: validatedData.roleName as RoleEnum
      })
      role = await roleRepository.save(role)
    }

    // Crear el usuario administrador
    const userService = new UserService()
    const user = await userService.createUser({
      ...validatedData,
      roleId: role.id
    })

    // No retornar la contraseña
    const userResponse = { ...user }
    delete (userResponse as any).password

    return formatResponse(userResponse, 'Administrador creado exitosamente', 201)
  } catch (error) {
    return formatError(error)
  }
}

