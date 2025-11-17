export enum StatusEnum {
  ACTIVE = "Activo",
  INACTIVE = "Inactivo"
}

export enum OtpTypeEnum {
  LOGIN = "Iniciar Sesión",
  RESET_PASSWORD = "Restablecer Contraseña"
}

export enum RoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_ALIADO = 'ADMIN_ALIADO',
  COMPANY = 'COMPANY',
}

export enum FormTemplateTypeEnum {
  PROVEEDOR = 'PROVEEDOR',
  CLIENTE = 'CLIENTE',
  TERCERO_GENERAL = 'TERCERO_GENERAL',
  PERSONALIZADO = 'PERSONALIZADO'
}

export enum SubmissionStatusEnum {
  EARRING = 'PENDIENTE',
  PROGRESS = 'PROCESANDO',
  PROCESSED = 'PROCESADO',
  DELETED = 'ELIMINADO',
}

export enum FieldTypeEnum {
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
  NUMBER = 'NUMBER',
  PHONE = 'PHONE',
  DATE = 'DATE',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
  FILE = 'FILE',
  URL = 'URL'
}

export interface CreateFieldOptionInput {
  label: string
  value: string
  displayOrder?: number
  isActive?: boolean
}

export interface CreateFormFieldInput {
  label: string
  fieldKey: string
  fieldType: string
  placeholder?: string
  helpText?: string
  isRequired?: boolean
  displayOrder?: number
  isActive?: boolean
  validations?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
    fileTypes?: string[]
    maxFileSize?: number
  }
  layoutConfig?: {
    columnSpan?: number
    width?: string
  }
  options?: CreateFieldOptionInput[]
}

export interface CreateFormModuleInput {
  name: string
  description?: string
  moduleKey: string
  displayOrder?: number
  isRequired?: boolean
  isActive?: boolean
  fields: CreateFormFieldInput[]
}

export interface CreateFormTemplateWithModulesInput {
  name: string
  description?: string
  templateType: string
  modules?: CreateFormModuleInput[]
  createdBy: string
}

