'use client';

import React, { useState } from 'react';
import { useGetAllFormTemplate } from '../../hook/formtemplate/useGetAllFormTemplate';
import { useAssignFormToCompany } from '../../hook/formassingment/useAssingFormToCompany';
import { useGetAssignedTemplates } from '../../hook/formassingment/useGetAssignedTemplates';
import AssignFormsHeader from './AssignFormsHeader';
import AssignFormsGrid from './AssignFormsGrid';
import AssignFormEmpty from './AssignFormEmpty';
import AssignFormLoading from './AssignFormLoading';
import AssignFormDialog from './AssignFormDialog';
import toast from 'react-hot-toast';
import { AssignFormsToCompanyProps, FormTemplate } from '../../types/models';


export default function AssignFormsToCompany({ companyId, companyName }: AssignFormsToCompanyProps) {
  const { formtemplates, loading: isLoading } = useGetAllFormTemplate();
  const { assignForm, loading: assigning } = useAssignFormToCompany();
  const { assignments, loading: loadingAssigned } = useGetAssignedTemplates(companyId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);

  const handleOpenDialog = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handleAssign = async (config: {
    allowMultipleSubmissions: boolean;
    allowEditAfterSubmit: boolean;
    expiresAt?: string;
    welcomeMessage?: string;
  }) => {
    if (!selectedTemplate) {
      toast.error('Error: No se seleccionó ningún formulario');
      return;
    }

    const result = await assignForm({
      companyId,
      formTemplateId: selectedTemplate.id,
      ...config,
      customConfig: config.welcomeMessage ? { welcomeMessage: config.welcomeMessage } : undefined
    });

    if (result.success) {
      setIsDialogOpen(false);
      toast.success('Formulario asignado correctamente');
      window.location.reload();
    }
  };

  if (isLoading || loadingAssigned) {
    return <AssignFormLoading />;
  }

  // Obtener IDs de templates ya asignados
  const assignedTemplateIds = new Set(
    assignments.map((assignment: any) => assignment.id).filter(Boolean)
  );

  // Filtrar templates disponibles
  const availableTemplates = formtemplates?.filter((template) => {
    const hasModules = template.moduleAssignments && template.moduleAssignments.length > 0;
    const isAssigned = assignedTemplateIds.has(template.id);
    return hasModules && !isAssigned;
  }) || [];

  return (
    <div className="space-y-6">
      <AssignFormsHeader 
        availableCount={availableTemplates.length}
        assignedCount={assignedTemplateIds.size}
      />
      
      {availableTemplates.length === 0 ? (
        <AssignFormEmpty 
          companyName={companyName}
          totalTemplates={formtemplates?.length || 0}
          assignedCount={assignedTemplateIds.size}
        />
      ) : (
        <AssignFormsGrid 
          templates={availableTemplates}
          onAssign={handleOpenDialog}
        />
      )}

      <AssignFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        template={selectedTemplate}
        companyName={companyName}
        onConfirm={handleAssign}
        isAssigning={assigning}
      />
    </div>
  );
}