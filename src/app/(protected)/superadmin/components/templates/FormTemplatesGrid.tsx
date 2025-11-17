'use client';

import React from 'react';
import FormTemplateCard from './FormTemplateCard';

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  templateType: string;
  status: string;
  created_at: string;
  moduleAssignments?: Array<{
    module?: {
      fields?: any[];
    };
  }>;
}

interface FormTemplatesGridProps {
  templates: FormTemplate[];
}

export default function FormTemplatesGrid({ templates }: FormTemplatesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <FormTemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

