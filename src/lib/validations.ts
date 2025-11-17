import { z } from 'zod'

export const createUserSchema = z.object({
  firstName: z.string()
    .min(1, "El primer nombre es obligatorio") 
    .min(3, "El primer nombre debe tener mínimo 3 caracteres")
    .max(50, "El primer nombre debe tener máximo 50 caracteres")
    .transform((str) => str.trim()),

  secondName: z.string()
    .min(1) 
    .min(3, "El segundo nombre debe tener mínimo 3 caracteres")
    .max(50, "El segundo nombre debe tener máximo 50 caracteres")
    .transform((str) => str.trim())
    .optional()
    .or(z.literal('')), 

  firstMiddleName: z.string()
    .min(1, "El primer apellido es obligatorio")
    .min(3, "El primer apellido debe tener mínimo 3 caracteres")
    .max(50, "El primer apellido debe tener máximo 50 caracteres")
    .transform((str) => str.trim()),

  secondMiddleName: z.string()
    .min(1)
    .min(3, "El segundo apellido debe tener mínimo 3 caracteres")
    .max(50, "El segundo apellido debe tener máximo 50 caracteres")
    .transform((str) => str.trim())
    .optional()
    .or(z.literal('')),

  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Debe ser un email válido")
    .max(255, "El email debe tener máximo 255 caracteres")
    .regex(/@gmail\.com$/, "Solo se permiten correos de Gmail")
    .transform((email) => email.trim().toLowerCase()),

  codePhone: z.string()
    .min(1, "El código telefónico es obligatorio")
    .max(5, "El código telefónico debe tener máximo 5 caracteres"),

  phone: z.string()
    .min(1, "El teléfono es obligatorio")
    .min(5, "El teléfono debe tener al menos 5 caracteres")
    .max(15, "El teléfono debe tener máximo 15 caracteres")
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números"),

  username: z.string()
    .min(1, "El usuario es obligatorio")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario debe tener máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "El usuario solo puede contener letras, números y guiones bajos")
    .transform((str) => str.trim().toLowerCase()),

  password: z.string()
    .min(1, "La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña debe tener máximo 100 caracteres")
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, 
    "La contraseña debe contener mayúscula, minúscula, número y carácter especial"),

  roleId: z.string()
    .min(1, "El rol es obligatorio")
})



export const createCompanySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres")
    .transform((str) => str.trim()),

  nit: z
    .string()
    .min(8, "El NIT debe tener al menos 8 caracteres")
    .max(15, "El NIT debe tener máximo 15 caracteres")
    .regex(/^[0-9\-]+$/, "El NIT solo puede contener números y guiones")
    .transform((str) => str.trim().replace(/\s+/g, '')),

  razonSocial: z
    .string()
    .min(3, "La razón social debe tener al menos 3 caracteres")
    .max(100, "La razón social debe tener máximo 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.,\-&]+$/, "La razón social contiene caracteres no válidos")
    .transform((str) => str.trim())
    .optional(),

  country: z
    .string()
    .min(3, "El país debe tener al menos 3 caracteres")
    .max(50, "El país debe tener máximo 50 caracteres")
    .transform((str) => str.trim()),

  city: z
    .string()
    .min(3, "La ciudad debe tener al menos 3 caracteres")
    .max(50, "La ciudad debe tener máximo 50 caracteres")
    .transform((str) => str.trim()),

  address: z
    .string()
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .max(100, "La dirección debe tener máximo 100 caracteres")
    .transform((str) => str.trim()),
    
  logoUrl: z.unknown().optional(),

   // createdBy se agregará automáticamente desde el hook
  createdBy: z.string().uuid("El ID del creador debe ser un UUID válido").optional(),

  contactEmail: z
    .string()
    .email("Debe ser un email válido")
    .min(5, "El email es obligatorio")
    .max(255, "El email debe tener máximo 255 caracteres")
    .transform((email) => email.trim().toLowerCase()),

  contactPhone: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 caracteres")
    .max(15, "El teléfono debe tener máximo 15 caracteres")
    .regex(/^[0-9]+$/, "El teléfono solo puede contener números"),

  contactPhoneCountryCode: z
    .string()
    .min(2, "El código de país debe tener al menos 2 caracteres")
    .max(4, "El código de país debe tener máximo 4 caracteres")
    .regex(/^\+[0-9]+$/, "El código de país debe empezar con '+' y contener solo números"),

  contactFirstName: z
    .string()
    .min(3, "El primer nombre es obligatorio")
    .max(50, "El primer nombre debe tener máximo 50 caracteres")
    .transform((str) => str.trim().toLowerCase()),

  contactLastName: z
    .string()
    .min(3, "El segundo nombre debe tener al menos 3 caracteres")
    .max(50, "El segundo nombre debe tener máximo 50 caracteres")
    .transform((str) => str.trim().toLowerCase())
    .optional(),

  contactPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña debe tener máximo 100 caracteres")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
      "La contraseña debe contener mayúscula, minúscula, número y carácter especial"
    ),
});

export type TypeCreateSchema = z.infer<typeof createCompanySchema>;

/**
 * Schema de validación para actualizar el perfil del usuario (SUPER_ADMIN)
 * Todos los campos son opcionales para permitir actualizaciones parciales
 */
export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "El primer nombre debe tener al menos 2 caracteres")
      .max(50, "El primer nombre debe tener máximo 50 caracteres")
      .transform((str) => str.trim())
      .optional(),

    secondName: z
      .string()
      .min(2, "El segundo nombre debe tener al menos 2 caracteres")
      .max(50, "El segundo nombre debe tener máximo 50 caracteres")
      .transform((str) => str.trim())
      .nullable()
      .optional(),

    firstMiddleName: z
      .string()
      .min(2, "El primer apellido debe tener al menos 2 caracteres")
      .max(50, "El primer apellido debe tener máximo 50 caracteres")
      .transform((str) => str.trim())
      .optional(),

    secondMiddleName: z
      .string()
      .min(2, "El segundo apellido debe tener al menos 2 caracteres")
      .max(50, "El segundo apellido debe tener máximo 50 caracteres")
      .transform((str) => str.trim())
      .nullable()
      .optional(),

    email: z
      .string()
      .email("Debe ser un email válido")
      .min(5, "El email debe tener al menos 5 caracteres")
      .max(255, "El email debe tener máximo 255 caracteres")
      .transform((email) => email.trim().toLowerCase())
      .optional(),

    codePhone: z
      .string()
      .min(1, "El código telefónico es obligatorio")
      .max(5, "El código telefónico debe tener máximo 5 caracteres")
      .optional(),

    phone: z
      .string()
      .min(5, "El teléfono debe tener al menos 5 caracteres")
      .max(15, "El teléfono debe tener máximo 15 caracteres")
      .regex(/^[0-9]+$/, "El teléfono solo debe contener números")
      .optional(),

    username: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(20, "El usuario debe tener máximo 20 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "El usuario solo puede contener letras, números y guiones bajos")
      .transform((str) => str.trim().toLowerCase())
      .optional(),
  })
  .partial();

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
