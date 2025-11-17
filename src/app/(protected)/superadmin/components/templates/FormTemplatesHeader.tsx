'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FormTemplatesHeaderProps {
  totalTemplates: number;
  activeTemplates: number;
}

export default function FormTemplatesHeader({ totalTemplates, activeTemplates }: FormTemplatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Formularios</h2>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona tus formularios creados
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {totalTemplates} total{totalTemplates !== 1 ? 'es' : ''}
          </Badge>
          <Badge variant="default" className="text-sm">
            {activeTemplates} activo{activeTemplates !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
    </div>
  );
}

