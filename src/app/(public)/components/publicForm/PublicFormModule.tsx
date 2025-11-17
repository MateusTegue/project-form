'use client';

import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import PublicFormField from './PublicFormField';
import { PublicFormModuleProps } from '../../types/models';
import { getFieldOrderForModule } from '@/utils/modulesAndFieldsData';


export default function PublicFormModule({ module, isRequired, formData, onInputChange}: PublicFormModuleProps) {
  const moduleFields = module.fields || [];
  
  // Ordenar campos según el orden del JSON
  const fields = useMemo(() => {
    const fieldOrder = getFieldOrderForModule(module.moduleKey || '');
    
    return [...moduleFields].sort((a: any, b: any) => {
      const orderA = fieldOrder.get(a.fieldKey || '') ?? 999;
      const orderB = fieldOrder.get(b.fieldKey || '') ?? 999;
      return orderA - orderB;
    });
  }, [moduleFields, module.moduleKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Layers className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center gap-2 flex-wrap" title={module.name}>
            <span className="truncate">{module.name}</span>
            {isRequired && (
              <Badge variant="destructive" className="text-xs shrink-0">
                Obligatorio
              </Badge>
            )}
          </h3>
          {module.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2" title={module.description}>
              {module.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 pl-0 md:pl-14">
        {fields.map((field: any) => (
          <PublicFormField
            key={field.id}
            field={field}
            value={formData[field.fieldKey] || ''}
            onChange={(value) => onInputChange(field.fieldKey, value)}
          />
        ))}
      </div>
    </div>
  );
}