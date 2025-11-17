import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { authMiddleware } from '@/lib/middlewares/auth.middleware'
import { superAdminOrCompany } from '@/lib/middlewares/role.middleware'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'
import { NotFoundError } from '@/lib/helpers/exceptions-errors'

interface ModuleWithAnswers {
  id: string
  name: string
  description?: string
  moduleKey: string
  displayOrder: number
  isRequired: boolean
  fields: FieldWithAnswer[]
}

interface FieldWithAnswer {
  id: string
  label: string
  fieldKey: string
  fieldType: string
  placeholder?: string
  helpText?: string
  isRequired: boolean
  displayOrder: number
  validations?: any
  layoutConfig?: any
  options?: Array<{
    id: string
    label: string
    value: string
    displayOrder: number
  }>
  answer?: {
    id: string
    textValue?: string
    numberValue?: number
    dateValue?: Date
    jsonValue?: any
    fileUrl?: string
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseInitialized()

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult

    const roleCheck = superAdminOrCompany(authResult.user)
    if (roleCheck) return roleCheck

    const { id } = await params

    const submission = await FormSubmissionRepository.getSubmissionById(id)

    if (!submission) {
      throw new NotFoundError('Submission no encontrada')
    }

    if (!submission.companyFormAssignment) {
      throw new Error('Company form assignment not found')
    }

    if (!submission.companyFormAssignment.formTemplate) {
      throw new Error('Form template not found')
    }

    if (!submission.companyFormAssignment.company) {
      throw new Error('Company not found')
    }

    const modulesMap = new Map<string, ModuleWithAnswers>()

    const moduleAssignments = submission.companyFormAssignment.formTemplate.moduleAssignments || []

    moduleAssignments.sort((a: any, b: any) => a.displayOrder - b.displayOrder)

    for (const assignment of moduleAssignments) {
      if (!assignment.module) {
        continue
      }

      const module = assignment.module
      
      const sortedFields = [...(module.fields || [])].sort(
        (a, b) => a.displayOrder - b.displayOrder
      )

      const fieldsWithAnswers: FieldWithAnswer[] = sortedFields
        .filter(field => field.isActive)
        .map(field => {
          const answer = submission.answers?.find(
            (ans: any) => ans.fieldKey === field.fieldKey
          )

          const sortedOptions = field.options 
            ? [...field.options].sort((a, b) => a.displayOrder - b.displayOrder)
            : []

          return {
            id: field.id,
            label: field.label,
            fieldKey: field.fieldKey,
            fieldType: field.fieldType,
            placeholder: field.placeholder,
            helpText: field.helpText,
            isRequired: field.isRequired,
            displayOrder: field.displayOrder,
            validations: field.validations,
            layoutConfig: field.layoutConfig,
            options: sortedOptions.map(opt => ({
              id: opt.id,
              label: opt.label,
              value: opt.value,
              displayOrder: opt.displayOrder
            })),
            answer: answer ? {
              id: answer.id,
              textValue: answer.textValue,
              numberValue: answer.numberValue,
              dateValue: answer.dateValue,
              jsonValue: answer.jsonValue,
              fileUrl: answer.fileUrl
            } : undefined
          }
        })

      modulesMap.set(module.moduleKey, {
        id: module.id,
        name: module.name,
        description: module.description,
        moduleKey: module.moduleKey,
        displayOrder: assignment.displayOrder,
        isRequired: assignment.isRequired,
        fields: fieldsWithAnswers
      })
    }

    const modules = Array.from(modulesMap.values()).sort(
      (a, b) => a.displayOrder - b.displayOrder
    )

    const data = {
      submissionInfo: {
        id: submission.id,
        submitterName: submission.submitterName,
        submitterEmail: submission.submitterEmail,
        submitterPhone: submission.submitterPhone,
        submitterDocumentId: submission.submitterDocumentId,
        status: submission.status,
        submittedAt: submission.submittedAt,
        reviewNotes: submission.reviewNotes,
        reviewedBy: submission.reviewedBy,
        reviewedAt: submission.reviewedAt
      },
      formInfo: {
        id: submission.companyFormAssignment.formTemplate.id,
        templateName: submission.companyFormAssignment.formTemplate.name,
        templateDescription: submission.companyFormAssignment.formTemplate.description,
        companyName: submission.companyFormAssignment.company.name
      },
      modules
    }

    return formatResponse(data, 'Form submission with modules retrieved successfully')
  } catch (error) {
    return formatError(error)
  }
}

