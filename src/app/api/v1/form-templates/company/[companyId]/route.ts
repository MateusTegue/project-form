import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { CompanyFormAssignmentRepository } from '@/lib/repositories/companyformassignment.repository'
import { StatusEnum } from '@/lib/enums/EnumEntity'

export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const assignments = await CompanyFormAssignmentRepository.find({
      where: {
        company: { id: params.companyId },
        status: StatusEnum.ACTIVE
      },
      relations: {
        formTemplate: {
          createdBy: true,
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

    const templates = assignments.map((assignment: any) => assignment.formTemplate)

    return formatResponse(templates, 'Form templates retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

