import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'
import { SubmissionStatusEnum } from '@/lib/enums/EnumEntity'
import { http, ResponseCode } from '@/lib/helpers/request'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const { companyId } = await params

    // Si es COMPANY, verificar que solo pueda acceder a sus propios datos
    const userRole = typeof authResult.user.role === 'string' 
      ? authResult.user.role 
      : authResult.user.role?.name

    if (userRole === 'COMPANY' && authResult.user.id !== companyId) {
      return NextResponse.json(
        http.error(null, ResponseCode.PERMISSION_DENIED, ['No tienes permisos para acceder a esta información']),
        { status: ResponseCode.PERMISSION_DENIED }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status') as SubmissionStatusEnum | null
    const search = searchParams.get('search') || undefined

    const submissions = await FormSubmissionRepository.getSubmissionsByCompany({
      companyId,
      status: status || undefined,
      search,
    })

    return formatResponse(submissions, 'Submissions retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}