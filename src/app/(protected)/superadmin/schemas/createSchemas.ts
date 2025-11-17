import { z } from 'zod';
import { FieldTypeEnum } from '@/types/models';

const fieldOptionSchema = z.object({
  label: z
    .string()
    .min(1, 'La etiqueta de la opción es requerida')
    .max(200, 'La etiqueta no puede exceder 200 caracteres'),
  value: z
    .string()
    .min(1, 'El valor de la opción es requerido')
    .max(100, 'El valor no puede exceder 100 caracteres'),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true)
});

const validationsSchema = z
  .object({
    minLength: z.number().int().min(0).optional(),
    maxLength: z.number().int().min(0).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    fileTypes: z.array(z.string()).optional(),
    maxFileSize: z.number().int().min(0).optional()
  })
  .nullable()
  .optional();

const layoutConfigSchema = z
  .object({
    width: z.enum(['full', 'half', 'third', 'quarter']).optional(),
    col: z.number().int().min(1).max(12).optional(),
    row: z.number().int().min(1).optional()
  })
  .optional();

const formFieldSchema = z
  .object({
    label: z
      .string()
      .min(1, 'La etiqueta del campo es requerida')
      .max(200, 'La etiqueta no puede exceder 200 caracteres'),
    fieldKey: z
      .string()
      .min(1, 'La clave del campo es requerida')
      .max(100, 'La clave no puede exceder 100 caracteres')
      .regex(
        /^[a-z0-9_]+$/,
        'La clave solo puede contener letras minúsculas, números y guiones bajos'
      ),
    fieldType: z.nativeEnum(FieldTypeEnum),
    placeholder: z.string().max(255).optional(),
    helpText: z.string().max(500).nullable().optional(),
    isRequired: z.boolean().default(false),
    displayOrder: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
    validations: validationsSchema,
    layoutConfig: layoutConfigSchema,
    options: z.array(fieldOptionSchema).default([])
  })
  .refine(
    (data) => {
      const requiresOptions = ['SELECT', 'RADIO', 'CHECKBOX'].includes(
        data.fieldType
      );
      if (requiresOptions && (!data.options || data.options.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message:
        'Los campos de tipo SELECT, RADIO o CHECKBOX deben tener al menos una opción',
      path: ['options']
    }
  );

export const createModuleSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre del módulo debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  moduleKey: z
    .string()
    .min(1, 'La clave del módulo es requerida')
    .max(50, 'La clave no puede exceder 50 caracteres')
    .regex(
      /^[a-z0-9_]+$/,
      'La clave solo puede contener letras minúsculas, números y guiones bajos'
    ),
  isActive: z.boolean().default(true), 
  fields: z
    .array(formFieldSchema)
    .min(1, 'El módulo debe tener al menos un campo')
});

export type TypeCreateModuleSchema = z.infer<typeof createModuleSchema>;