export interface FormAssignment {
  assignmentId: string;      
  id: string;            
  name: string;
  description: string;
  templateType: string;
  status: string;
  created_at: string;
  publicToken?: string;      
  publicUrl?: string;
  isActive?: boolean;
  moduleAssignments?: any[];
}

export interface AssignedFormCardProps {
  assignment: FormAssignment;  
}

export interface AssignedFormItemProps {
  companyId: string;
  companyName?: string;
}

export interface AssignedFormEmptyProps {
  companyName?: string;
}

export interface AssignedFormErrorProps {
  error: string;
  onRetry?: () => void;
}

export interface AssignedFormItemProps {
  companyId: string;
  companyName?: string;
}

export interface IntegrationItemProps {
  title: string;
  description: string;
  param: string;
  enabled?: boolean;
}

export interface Submission {
  id: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  submitterDocumentId: string;
  status: 'PENDIENTE' | 'PROCESANDO' | 'PROCESADO' | 'ELIMINADO';
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
  companyFormAssignment: {
    id: string;
    formTemplate: {
      id: string;
      name: string;
      templateType: string;
    };
    company: {
      id: string;
      name: string;
    };
  };
  answers: Array<{
    id: string;
    fieldKey: string;
    textValue?: string;
    numberValue?: number;
    dateValue?: string;
    field: {
      id: string;
      label: string;
      fieldKey: string;
      fieldType: string;
      displayOrder?: number;
      module?: {
        id: string;
        name: string;
        moduleKey: string;
      };
    };
  }>;
}

export interface SagridocsItemProps {
  submission: Submission;
}

export type SubmissionStatus = "PENDIENTE" | "PROCESANDO" | "PROCESADO" | "ELIMINADO";

export interface SagridocsEmptyProps {
  searchQuery: string;
  currentStatus: SubmissionStatus;
  onClearSearch: () => void;
}

export interface SagridocsFiltersProps {
  currentStatus: SubmissionStatus;
  onStatusChange: (status: SubmissionStatus) => void;
}

export interface SagridocsHeaderProps {
  submissionsCount: number;
  loading: boolean;
  onExport: () => void;
  onRefresh: () => void;
}

export interface SagridocsLoadingProps {
  message?: string;
}

export interface SagridocsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export interface SagridocsTableProps {
  submissions: Submission[];
  loading: boolean;
  searchQuery: string;
  currentStatus: SubmissionStatus;
  onClearSearch: () => void;
}

export interface ShareLinkFormProps {
  token: string;
  formName: string;
}

// Nueva interfaz para la respuesta organizada por módulos
export interface SubmissionWithModules {
  submissionInfo: {
    id: string;
    submitterName?: string;
    submitterEmail?: string;
    submitterPhone?: string;
    submitterDocumentId?: string;
    status: string;
    submittedAt?: string;
    reviewNotes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
  };
  formInfo: {
    id: string;
    templateName: string;
    templateDescription?: string;
    companyName: string;
  };
  modules: Array<{
    id: string;
    name: string;
    description?: string;
    moduleKey: string;
    displayOrder: number;
    isRequired: boolean;
    fields: Array<{
      id: string;
      label: string;
      fieldKey: string;
      fieldType: string;
      placeholder?: string;
      helpText?: string;
      isRequired: boolean;
      displayOrder: number;
      validations?: any;
      layoutConfig?: any;
      options?: Array<{
        id: string;
        label: string;
        value: string;
        displayOrder: number;
      }>;
      answer?: {
        id: string;
        textValue?: string;
        numberValue?: number;
        dateValue?: string;
        jsonValue?: any;
        fileUrl?: string;
      };
    }>;
  }>;
}

