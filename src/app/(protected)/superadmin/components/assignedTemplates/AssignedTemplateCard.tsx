'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Layers, ListChecks } from 'lucide-react';
import AssignedTemplateCardActions from './AssignedTemplateCardActions';

interface AssignedTemplateCardProps {
  assignment: any;
  onRemove: (assignmentId: string, templateName: string) => void;
  unassigning: boolean;
}

export default function AssignedTemplateCard({ 
  assignment, 
  onRemove, 
  unassigning 
}: AssignedTemplateCardProps) {
  const moduleCount = assignment.moduleAssignments?.length || 0;
  const totalFields = assignment.moduleAssignments?.reduce(
    (acc: number, mod: any) => acc + (mod.module?.fields?.length || 0),
    0
  ) || 0;

  const formattedDate = new Date(assignment.created_at).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-1">
              {assignment.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {assignment.description || 'Sin descripción'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0">
            Asignado
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 space-y-4">
        {/* Estadísticas */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Layers className="h-3 w-3" />
            {moduleCount} módulo{moduleCount !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <ListChecks className="h-3 w-3" />
            {totalFields} campo{totalFields !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Fecha de asignación */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Asignado: {formattedDate}</span>
        </div>

        <Separator />

        {/* Acciones */}
        <AssignedTemplateCardActions
          assignmentId={assignment.assignmentId}
          templateName={assignment.name}
          onRemove={onRemove}
          unassigning={unassigning}
        />
      </CardContent>
    </Card>
  );
}