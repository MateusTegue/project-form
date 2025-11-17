'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import type { FormTemplate } from './FormTemplatesGrid';

interface FormTemplateCardHeaderProps {
  template: FormTemplate;
}

export default function FormTemplateCardHeader({ template }: FormTemplateCardHeaderProps) {
  const getTemplateTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'TERCERO_GENERAL': 'Tercero General',
      'PROVEEDOR': 'Proveedor',
      'CLIENTE': 'Cliente',
      'PERSONALIZADO': 'Personalizado'
    };
    return types[type] || type;
  };

  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <Badge 
          variant={template.status === 'Activo' ? 'default' : 'secondary'}
          className="shrink-0"
        >
          {template.status || 'Activo'}
        </Badge>
      </div>
      
      <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
        {template.name}
      </CardTitle>
      
      <CardDescription className="line-clamp-2">
        {template.description || 'Sin descripción disponible'}
      </CardDescription>

      <div className="mt-2">
        <Badge variant="outline" className="text-xs">
          {getTemplateTypeLabel(template.templateType)}
        </Badge>
      </div>
    </CardHeader>
  );
}

