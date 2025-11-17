export interface PublicFormAlreadySubmittedProps {
  companyName?: string;
  formName?: string;
  allowMultiple?: boolean;
}

export interface PublicFormErrorProps {
  error: string | null;
  onRetry?: () => void;
}

export interface PublicFormFieldProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
}

export interface PublicFormFieldsProps {
  assignment: any;
  formData: Record<string, any>;
  onInputChange: (fieldKey: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export interface PublicFormHeaderProps {
  formName?: string;
  companyName?: string;
  companyLogo?: string;
  companyLocation?: string;
  welcomeMessage?: string;
}

export interface PublicFormModuleProps {
  module: any;
  isRequired: boolean;
  formData: Record<string, any>;
  onInputChange: (fieldKey: string, value: any) => void;
}

export interface PublicFormRefressButtonProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export interface PublicFormSubmitButtonProps {
  submitting: boolean;
}

export interface PublicFormSuccessProps {
  message?: string;
  companyName?: string;
  redirectUrl?: string;
}

export interface PublicFormViewProps {
  token: string;
}