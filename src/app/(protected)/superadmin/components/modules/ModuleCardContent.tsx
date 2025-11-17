'use client';

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Module } from './GetAllModulesCreated';

interface ModuleCardContentProps {
  module: Module;
}

export default function ModuleCardContent({ module }: ModuleCardContentProps) {
  const router = useRouter();
  
  const formattedDate = new Date(module.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/superadmin/page/modules/${module.id}`);
  };

  return (
    <CardContent className="space-y-3 flex-1 flex flex-col">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 shrink-0" />
          <span>
            {module.fields?.length || 0} campo{(module.fields?.length || 0) !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>Creado: {formattedDate}</span>
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={handleViewDetails}
      >
        <Eye className="h-4 w-4" />
        Ver Detalles
      </Button>
    </CardContent>
  );
}