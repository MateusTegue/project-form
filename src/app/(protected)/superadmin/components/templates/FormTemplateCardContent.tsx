'use client';

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Layers, Calendar, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FormTemplate } from './FormTemplatesGrid';

interface FormTemplateCardContentProps {
  template: FormTemplate;
}

export default function FormTemplateCardContent({ template }: FormTemplateCardContentProps) {
  const router = useRouter();
  
  const formattedDate = new Date(template.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const moduleCount = template.moduleAssignments?.length || 0;
  const totalFields = template.moduleAssignments?.reduce(
    (acc: number, assignment: any) => acc + (assignment.module?.fields?.length || 0),
    0
  ) || 0;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/superadmin/page/formstemplates/edit/${template.id}`);
  };

  return (
    <CardContent className="space-y-3 flex-1 flex flex-col">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="h-4 w-4 shrink-0" />
          <span>
            {moduleCount} módulo{moduleCount !== 1 ? 's' : ''} • {totalFields} campo{totalFields !== 1 ? 's' : ''}
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
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4" />
        Editar Formulario
      </Button>
    </CardContent>
  );
}

