export interface DeleteCompanyButtonProps {
  company: {
    id: string;
    name: string;
    nit?: string;
  };
  onSuccess?: () => void;
  variant?: "icon" | "text";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
}

export interface FilterByStatusDialogProps {
  onFilter: (status: string | null) => void;
}


export interface AssignFormsToCompanyProps {
  companyId: string;
  companyName: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  moduleAssignments?: Array<{
    module?: {
      fields?: any[];
    };
  }>;
}


export interface AssignFormEmptyProps {
  companyName: string;
  totalTemplates: number;
  assignedCount: number;
}

export interface AssignFormsHeaderProps {
  availableCount: number;
  assignedCount: number;
}


export interface AssignFormsGridProps {
  templates: FormTemplate[];
  onAssign: (template: FormTemplate) => void;
}


export interface AssignFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: FormTemplate | null;
  companyName: string;
  onConfirm: (config: {
    allowMultipleSubmissions: boolean;
    allowEditAfterSubmit: boolean;
    expiresAt?: string;
    welcomeMessage?: string;
  }) => void;
  isAssigning: boolean;
}


export interface AssignFormCardProps {
  template: FormTemplate;
  onAssign: (template: FormTemplate) => void;
}


export interface AssignFormDialogConfigProps {
  allowMultiple: boolean;
  setAllowMultiple: (value: boolean) => void;
  allowEdit: boolean;
  setAllowEdit: (value: boolean) => void;
  expiresAt: string;
  setExpiresAt: (value: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (value: string) => void;
}