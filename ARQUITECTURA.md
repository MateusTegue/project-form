# Arquitectura del Sistema CAPIN

## 📋 Descripción General

CAPIN es una aplicación web full-stack construida con **Next.js 15** (App Router) que implementa un sistema de gestión de formularios dinámicos con autenticación basada en roles. La aplicación sigue una arquitectura en capas con separación clara de responsabilidades.

## 🏗️ Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   (public)   │  │ (protected)  │  │   API Routes │         │
│  │   Routes     │  │   Routes     │  │   (Next.js) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                │
│         └──────────────────┼──────────────────┘                │
│                            │                                    │
│  ┌──────────────────────────────────────────────┐              │
│  │         React Components (UI Layer)          │              │
│  │  - SuperAdmin Components                     │              │
│  │  - Company Components                        │              │
│  │  - Public Form Components                    │              │
│  │  - Shared UI Components (Radix UI)            │              │
│  └──────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE LÓGICA DE NEGOCIO                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Services   │  │  Middlewares │  │    Hooks     │         │
│  │              │  │              │  │              │         │
│  │ - Auth       │  │ - Auth       │  │ - Profile   │         │
│  │ - User       │  │ - Role       │  │ - Users      │         │
│  │ - Company    │  │              │  │ - Forms      │         │
│  │ - Module     │  │              │  │              │         │
│  │ - OTP        │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE ACCESO A DATOS                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Repositories │  │   Entities   │  │  Data Source │         │
│  │              │  │              │  │              │         │
│  │ - User       │  │ - User       │  │ - TypeORM   │         │
│  │ - Company    │  │ - Company    │  │ - PostgreSQL │         │
│  │ - Form       │  │ - FormModule │  │ - Migrations │         │
│  │ - Submission │  │ - FormField  │  │              │         │
│  │ - Assignment │  │ - Submission │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BASE DE DATOS                             │
│                    PostgreSQL Database                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

### Flujo de Autenticación

```
Usuario → Login Page → API /api/auth → AuthService → UserRepository → DB
                                                          │
                                                          ▼
                                    JWT Token ← User Data ← DB Response
                                                          │
                                                          ▼
                                    Cookie Set → Protected Routes
```

### Flujo de Formulario Público

```
Usuario Público → /form/[token] → API /api/public/form/[token]
                                        │
                                        ▼
                            CompanyFormAssignmentRepository
                                        │
                                        ▼
                            FormTemplate + Modules + Fields
                                        │
                                        ▼
                            Renderizado del Formulario
                                        │
                                        ▼
                            Submit → API /api/public/form/[token]/submit
                                        │
                                        ▼
                            FormSubmissionRepository.createSubmission()
                                        │
                                        ▼
                            DB (FormSubmission + SubmissionAnswer)
```

### Flujo de Gestión de Formularios (SuperAdmin)

```
SuperAdmin → /superadmin/page/formstemplates → API /api/formtemplate
                                                      │
                                                      ▼
                                            FormTemplateService
                                                      │
                                                      ▼
                                            FormTemplateRepository
                                                      │
                                                      ▼
                                            DB (FormTemplate)
                                                      │
                                                      ▼
                            Asignación a Company → CompanyFormAssignment
                                                      │
                                                      ▼
                            Generación de Token Público
```

## 📦 Componentes Principales

### 1. Capa de Presentación

#### Rutas Públicas (`(public)`)
- `/login` - Autenticación de usuarios
- `/forgot-password` - Recuperación de contraseña
- `/form/[token]` - Formulario público accesible por token
- `/company/[slug]` - Página pública de empresa

#### Rutas Protegidas (`(protected)`)

**SuperAdmin (`/superadmin`)**
- Dashboard
- Gestión de Módulos (`/modules`)
- Gestión de Plantillas (`/formstemplates`)
- Gestión de Empresas (`/companies`)
- Gestión de Usuarios
- Perfil

**Company (`/company`)**
- Dashboard
- Formularios Asignados (`/forms`)
- Integraciones (`/integrations`)
- Submisiones (`/sagridocs`)
- Perfil

#### API Routes (`/api`)

**Rutas Principales:**
- `/api/auth` - Autenticación
- `/api/users` - Gestión de usuarios
- `/api/company` - Gestión de empresas
- `/api/modules` - Gestión de módulos
- `/api/formtemplate` - Gestión de plantillas
- `/api/formassingment` - Asignación de formularios
- `/api/submissions` - Gestión de submisiones
- `/api/public/form` - Formularios públicos

**Rutas v1 (Internas):**
- `/api/v1/*` - Versión interna de las APIs

### 2. Capa de Lógica de Negocio

#### Services (`src/lib/services/`)
- `auth.service.ts` - Lógica de autenticación y autorización
- `user.service.ts` - Lógica de negocio de usuarios
- `company.service.ts` - Lógica de negocio de empresas
- `module.service.ts` - Lógica de negocio de módulos
- `otp.service.ts` - Gestión de códigos OTP
- `changePassword.service.ts` - Cambio de contraseñas
- `base.ts` - Clase base para servicios

#### Middlewares (`src/lib/middlewares/`)
- `auth.middleware.ts` - Validación de autenticación JWT
- `role.middleware.ts` - Validación de roles y permisos

#### Hooks (`src/hooks/`)
- `profile/` - Hooks para gestión de perfiles
- `users/` - Hooks para gestión de usuarios
- `role/` - Hooks para gestión de roles

### 3. Capa de Acceso a Datos

#### Repositories (`src/lib/repositories/`)
- `user.repository.ts` - Acceso a datos de usuarios
- `company.repository.ts` - Acceso a datos de empresas
- `formtemplate.repository.ts` - Acceso a datos de plantillas
- `module.repository.ts` - Acceso a datos de módulos
- `formsubmission.repository.ts` - Acceso a datos de submisiones
- `companyformassignment.repository.ts` - Acceso a asignaciones
- `otp.repository.ts` - Acceso a códigos OTP
- `role.repository.ts` - Acceso a roles

#### Entities (`src/lib/database/entities/`)
- `user.ts` - Entidad Usuario
- `company.ts` - Entidad Empresa
- `role.ts` - Entidad Rol
- `formmodule.ts` - Entidad Módulo de Formulario
- `formfield.ts` - Entidad Campo de Formulario
- `fieldoption.ts` - Entidad Opción de Campo
- `formtemplate.ts` - Entidad Plantilla de Formulario
- `formTemplateModule.ts` - Relación Plantilla-Módulo
- `companyformassignment.ts` - Asignación Empresa-Formulario
- `formsubmission.ts` - Entidad Submisión
- `submissionanswer.ts` - Entidad Respuesta
- `companyUser.ts` - Relación Empresa-Usuario
- `otp.ts` - Entidad Código OTP

### 4. Base de Datos

#### Configuración (`src/lib/database/`)
- `data-source.ts` - Configuración de TypeORM
- `config.ts` - Configuración de conexión
- `connection.ts` - Inicialización de conexión
- `init.ts` - Inicialización lazy de la base de datos
- `migrations/` - Scripts de migración

## 🔐 Sistema de Autenticación y Autorización

### Autenticación
- **Método**: JWT (JSON Web Tokens)
- **Almacenamiento**: Cookies HTTP-only
- **Middleware**: `src/middleware.ts` valida rutas protegidas
- **Validación**: `auth.middleware.ts` verifica tokens en API routes

### Autorización por Roles
- **SUPER_ADMIN**: Acceso completo al sistema
- **ADMIN_ALIADO**: Acceso administrativo limitado
- **COMPANY**: Acceso a formularios y submisiones de su empresa

### Middleware de Rutas
```typescript
// Rutas protegidas por rol
protectedRoutes = {
  '/superadmin': ['SUPER_ADMIN', 'ADMIN_ALIADO'],
  '/company': ['COMPANY']
}
```

## 🗄️ Modelo de Datos

### Relaciones Principales

```
User ──┬── Role (Many-to-One)
       │
       └── CompanyUser ── Company (Many-to-Many)

Company ── CompanyFormAssignment ── FormTemplate
                                    │
                                    └── FormTemplateModule ── FormModule
                                                                    │
                                                                    └── FormField
                                                                        │
                                                                        └── FieldOption

CompanyFormAssignment ── FormSubmission
                            │
                            └── SubmissionAnswer ── FormField
```

### Entidades Clave

1. **User**: Usuarios del sistema
2. **Company**: Empresas aliadas
3. **FormTemplate**: Plantillas de formularios reutilizables
4. **FormModule**: Módulos que componen formularios
5. **FormField**: Campos dentro de módulos
6. **CompanyFormAssignment**: Asignación de formularios a empresas
7. **FormSubmission**: Submisiones de formularios
8. **SubmissionAnswer**: Respuestas individuales

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **UI Library**: React 19.1.0
- **Componentes**: Radix UI
- **Estilos**: Tailwind CSS 4
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **ORM**: TypeORM 0.3.27
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: Zod 4.1.11
- **Hashing**: bcrypt 6.0.0

### Herramientas de Desarrollo
- **TypeScript**: 5.x
- **Bundler**: Turbopack
- **Package Manager**: pnpm
- **Linting**: ESLint (implícito)
- **Migrations**: TypeORM CLI

## 📁 Estructura de Directorios

```
capin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Rutas públicas
│   │   ├── (protected)/      # Rutas protegidas
│   │   ├── api/               # API Routes
│   │   └── layout.tsx         # Layout raíz
│   ├── components/            # Componentes compartidos
│   │   ├── ui/               # Componentes UI base
│   │   └── ...               # Otros componentes
│   ├── lib/                   # Lógica de negocio
│   │   ├── database/         # Configuración DB
│   │   ├── entities/         # Entidades TypeORM
│   │   ├── repositories/     # Repositorios
│   │   ├── services/        # Servicios
│   │   ├── middlewares/      # Middlewares
│   │   └── utils/            # Utilidades
│   ├── hooks/                # Custom hooks
│   ├── types/                # Tipos TypeScript
│   └── middleware.ts         # Middleware de Next.js
├── scripts/                   # Scripts de utilidad
├── public/                    # Archivos estáticos
└── package.json
```

## 🔄 Patrones de Diseño Implementados

### 1. Repository Pattern
- Abstracción de acceso a datos
- Repositorios extendidos de TypeORM
- Métodos personalizados por entidad

### 2. Service Layer Pattern
- Lógica de negocio separada de acceso a datos
- Servicios que usan repositorios
- Clase base `Service` para funcionalidad común

### 3. Middleware Pattern
- Autenticación y autorización centralizadas
- Validación de roles reutilizable
- Aplicado en API routes y rutas protegidas

### 4. Component Composition
- Componentes pequeños y reutilizables
- Separación de lógica y presentación
- Hooks personalizados para lógica compartida

## 🚀 Flujos de Trabajo Principales

### 1. Creación de Formulario
```
SuperAdmin → Crear Módulos → Crear Campos → Crear Plantilla → Asignar a Empresa → Generar Token
```

### 2. Envío de Formulario Público
```
Usuario → Accede con Token → Completa Formulario → Submit → Validación → Guardado en DB
```

### 3. Revisión de Submisiones
```
Company → Ver Submisiones → Filtrar/Ordenar → Ver Detalles → Cambiar Estado → Notas
```

## 🔒 Seguridad

### Implementaciones de Seguridad
- **JWT Tokens**: Autenticación stateless
- **HTTP-only Cookies**: Prevención de XSS
- **Role-based Access Control**: Autorización granular
- **Input Validation**: Zod schemas
- **SQL Injection Prevention**: TypeORM parameterized queries
- **Password Hashing**: bcrypt con salt rounds

### Middleware de Seguridad
- Validación de tokens en cada request
- Verificación de roles antes de acceso
- Protección de rutas sensibles
- Validación de datos de entrada

## 📊 Características Principales

1. **Formularios Dinámicos**: Sistema flexible de módulos y campos
2. **Multi-tenant**: Soporte para múltiples empresas
3. **Formularios Públicos**: Acceso mediante tokens únicos
4. **Gestión de Submisiones**: Tracking completo de respuestas
5. **Roles y Permisos**: Sistema granular de acceso
6. **Dashboard Analytics**: Estadísticas por empresa
7. **Exportación de Datos**: Funcionalidad de exportación a Excel

## 🔧 Scripts de Utilidad

- `migration:run` - Ejecutar migraciones
- `migration:revert` - Revertir última migración
- `migration:show` - Mostrar migraciones pendientes
- `migration:generate` - Generar nueva migración
- `update:field-options` - Actualizar opciones de campos desde JSON

## 📝 Notas de Arquitectura

1. **Lazy Database Initialization**: La base de datos se inicializa en el primer request para optimizar el startup
2. **TypeORM con Next.js**: Configuración especial para evitar problemas con dynamic imports
3. **API Routes Duales**: Mantiene compatibilidad con rutas `/api` y `/api/v1`
4. **Server Components**: Uso extensivo de Server Components de Next.js 15
5. **Type Safety**: TypeScript estricto en todo el proyecto
6. **Error Handling**: Manejo centralizado de errores con formatos consistentes

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0

