import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyFormAssignmentRepository } from '@/lib/repositories/companyformassignment.repository'
import { StatusEnum } from '@/lib/enums/EnumEntity'

export async function GET(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const assignments = await CompanyFormAssignmentRepository.find({
      where: {
        formTemplate: { id: params.templateId },
        status: StatusEnum.ACTIVE
      },
      relations: {
        company: true,
        formTemplate: {
          moduleAssignments: {
            module: {
              fields: {
                options: true
              }
            }
          }
        }
      },
      order: {
        created_at: 'DESC'
      }
    } as any)

    return formatResponse(assignments, 'Template assignments retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

