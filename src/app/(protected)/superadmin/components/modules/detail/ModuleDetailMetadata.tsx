'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Calendar, Key } from 'lucide-react';

interface ModuleDetailMetadataProps {
  module: any;
}

export default function ModuleDetailMetadata({ module }: ModuleDetailMetadataProps) {
  const formattedDate = new Date(module.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-4">
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Key className="h-4 w-4" />
            Clave del módulo
          </div>
          <code className="text-sm bg-muted px-3 py-2 rounded-md block font-mono">
            {module.moduleKey}
          </code>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Fecha de creación
          </div>
          <div className="text-sm px-3 py-2">
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
}