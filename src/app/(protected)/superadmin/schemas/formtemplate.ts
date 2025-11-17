import { z } from "zod";
import { FormTemplateTypeEnum, FieldTypeEnum } from "@/types/models";

const fieldOptionSchema = z.object({
  label: z.string().min(1, "La etiqueta es requerida"),
  value: z.string().min(1, "El valor es requerido"),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

const validationsSchema = z
  .object({
    minLength: z.number().int().min(0).optional(),
    maxLength: z.number().int().min(1).optional(),
    pattern: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    fileTypes: z.array(z.string()).optional(),
    maxFileSize: z.number().int().min(0).optional(),
  })
  .optional();

const layoutConfigSchema = z
  .object({
    columnSpan: z.number().int().min(1).max(12).optional(),
    width: z.enum(["full", "half", "third", "quarter"]).optional(),
  })
  .optional();

const formFieldSchema = z
  .object({
    label: z.string().min(1, "La etiqueta del campo es requerida"),
    fieldKey: z.string().min(1, "La clave del campo es requerida").regex(/^[a-z0-9_]+$/, "Solo letras minúsculas, números y guiones bajos"),
    fieldType: z.nativeEnum(FieldTypeEnum),
    placeholder: z.string().max(255).optional(),
    helpText: z.string().max(500).optional(),
    isRequired: z.boolean(),
    displayOrder: z.number().int().min(0),
    isActive: z.boolean(),
    validations: validationsSchema,
    layoutConfig: layoutConfigSchema,
    options: z.array(fieldOptionSchema).optional(),
  })
  .refine(
    (data) => {
      const requiresOptions = ["SELECT", "RADIO", "CHECKBOX"].includes(
        data.fieldType
      );
      if (requiresOptions && (!data.options || data.options.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Los campos SELECT, RADIO y CHECKBOX deben tener opciones",
      path: ["options"],
    }
  );

const formModuleSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre del módulo debe tener al menos 3 caracteres"),
  description: z.string().max(500).optional(),
  moduleKey: z
    .string()
    .min(1, "La clave del módulo es requerida")
    .regex(/^[a-z0-9_]+$/, "Solo letras minúsculas, números y guiones bajos"),
  displayOrder: z.number().int().min(0),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  fields: z
    .array(formFieldSchema)
    .min(1, "El módulo debe tener al menos un campo"),
});

export const createFormtemplateSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  description: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional(),
  templateType: z.nativeEnum(FormTemplateTypeEnum),
  modules: z.array(formModuleSchema),
});

export type CreateFormtemplateInput = z.infer<typeof createFormtemplateSchema>;
