import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseInitialized } from '@/lib/database/init'
import { formatResponse, formatError } from '@/lib/utils/api-response'
import { FormSubmissionRepository } from '@/lib/repositories/formsubmission.repository'
import { z } from 'zod'

const createSubmissionSchema = z.object({
  publicToken: z.string().uuid(),
  submitterEmail: z.string().email().optional(),
  submitterName: z.string().optional(),
  submitterPhone: z.string().optional(),
  submitterDocumentId: z.string().optional(),
  answers: z.record(z.string(), z.any()),
})

export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseInitialized()

    const body = await req.json()
    const validatedData = createSubmissionSchema.parse(body)

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    const submission = await FormSubmissionRepository.createSubmission({
      ...validatedData,
      ipAddress,
      userAgent,
    })

    return formatResponse(submission, 'Form submission created successfully', 201)
  } catch (error) {
    return formatError(error)
  }
}

