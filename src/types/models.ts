export interface User {
  id: string;
  firstName: string;
  secondName?: string | null;
  firstMiddleName: string;
  secondMiddleName?: string | null;
  email: string;
  codePhone: string;
  phone: string;
  username: string;
  status: string;
  token?: string;
  role: {
    name: string;
  }
}

export interface UserItemProps {
  user: User;
}

export interface Role {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoleItemProps {
  role: Role;
}

export interface Company {
  id:  string;
  name: string;
  nit: string;
  razonSocial: string;
  country: string;
  city: string;
  address: string;
  logoUrl?: string;
  createdBy: string;
  contactEmail: string;
  contactPhone: string;
  contactPhoneCountryCode: string;
  contactFirstName: string;
  contactLastName: string;
  contactPassword: string;
  status: string;
  redirectUrl?: string;
  companySlug?: string;
  companyInfo?: {
    title?: string;
    description?: string;
    content?: string;
    navigation?: Array<{
      label: string;
      href?: string;
      target?: '_self' | '_blank';
    }>;
    contactInfo?: {
      email?: string;
      phone?: string;
      website?: string;
    };
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
    [key: string]: any;
  };
}

export interface CompanyItemProps {
  company: Company;
}

export interface CreateCompanyResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface CreateUserResponse {
  success: boolean;
  data?: any;
  error?: string;
}


export enum FormTemplateTypeEnum {
  PROVEEDOR = 'PROVEEDOR',
  CLIENTE = 'CLIENTE',
  TERCERO_GENERAL = 'TERCERO_GENERAL',
  PERSONALIZADO = 'PERSONALIZADO'
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

export type LayoutWidth = 'full' | 'half' | 'third' | 'quarter';

export interface FieldOption {
  label: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

export interface FormField {
  label: string;
  fieldKey: string;
  fieldType: FieldTypeEnum;
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
  validations?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    fileTypes?: string[];
    maxFileSize?: number;
  };
  layoutConfig?: {
    columnSpan?: number;
    width?: LayoutWidth; 
  };
  options?: FieldOption[]; 
}

export interface FormModule {
  moduleId: string;
  name: string;
  description?: string; 
  moduleKey: string;
  displayOrder: number;
  isRequired: boolean;
  isActive: boolean;
  fields: FormField[];
}

export interface FormTemplateData {
  name: string;
  description?: string;
  templateType: FormTemplateTypeEnum;
  createdBy: string;
  modules: FormModule[];
}

export interface CreateFormtemplateResponse {
  success: boolean;
  data?: any;
  error?: string;
}


export interface FieldOption {
  id: string;
  label: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

export interface FormField {
  id: string;
  label: string;
  fieldKey: string;
  fieldType: FieldTypeEnum;
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  displayOrder: number;
  options?: FieldOption[];
}

export interface ModuleAssignment {
  id: string;
  displayOrder: number;
  isRequired: boolean;
  isActive: boolean;
  module: {
    id: string;
    name: string;
    description?: string;
    moduleKey: string;
    fields: FormField[];
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  templateType: string;
  status: string;
  moduleAssignments: ModuleAssignment[];
}

export interface CompanyListProps {
    companies: Company[];
    onFilter?: (status: string | null) => void;
    loading?: boolean;
    error?: string | null;
}

export interface AssignedTemplatesListProps {
  companyId: string;
  companyName: string;
}


export interface AssignFormInput {
  companyId: string;
  formTemplateId: string;
  allowMultipleSubmissions?: boolean;
  allowEditAfterSubmit?: boolean;
  expiresAt?: string;
  customConfig?: {
    welcomeMessage?: string;
    successMessage?: string;
    companyLogo?: string;
    primaryColor?: string;
  };
}


export interface AssignedTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  templateType: string;
  status: string;
  moduleAssignments: any[];
  createdBy: any;
}
