import { NextResponse } from 'next/server'
import { http, ResponseCode } from '../helpers/request'
import { getStatusByException } from '../helpers/exceptions-errors'

export const formatResponse = (data: any, message = '', code = ResponseCode.OK) => {
  return NextResponse.json(http.response(data, code, message), { status: code })
}

export const formatError = (error: unknown) => {
  const statusCode = getStatusByException(error)
  const data = error instanceof Error && 'data' in error ? (error as any).data : null
  const errors = [error instanceof Error ? error.message : 'Error desconocido']
  
  return NextResponse.json(
    http.error(data, statusCode, errors),
    { status: statusCode }
  )
}

