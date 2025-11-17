'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ModuleDeleteDialog from './ModuleDeleteDialog';

interface ModuleDetailHeaderProps {
  module: any;
}

export default function ModuleDetailHeader({ module }: ModuleDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => router.push(`/superadmin/page/modules/${module.id}/edit`)}
          className="gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
        
        <ModuleDeleteDialog 
          moduleId={module.id}
          moduleName={module.name}
        />
      </div>
    </div>
  );
}