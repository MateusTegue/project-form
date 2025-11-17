"use client";
import React from 'react';
import FormTemplateListForCompany from '../formassingment/AssignFormsToCompany';
import AssignedTemplatesList from '../assignedTemplates/AssignedTemplatesList';

export default function ContenDinamicOptions({ optionSelected, companyId, companyName}: {
  optionSelected: 'assign' | 'assigned';
  companyId: string;
  companyName: string;
}) {
  return (
    <div className="mt-6">
      {optionSelected === 'assign' ? (
        <FormTemplateListForCompany 
          companyId={companyId} 
          companyName={companyName}
        />        
      ) : (
        <AssignedTemplatesList
          companyId={companyId} 
          companyName={companyName}
        />
      )}
    </div>
  );
}