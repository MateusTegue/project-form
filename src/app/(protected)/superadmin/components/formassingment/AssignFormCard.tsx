'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, Layers, ListChecks } from 'lucide-react';
import { AssignFormCardProps } from '../../types/models';



export default function AssignFormCard({ template, onAssign }: AssignFormCardProps) {
  const moduleCount = template.moduleAssignments?.length || 0;
  const totalFields = template.moduleAssignments?.reduce(
    (acc, assignment) => acc + (assignment.module?.fields?.length || 0),
    0
  ) || 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 group flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight line-clamp-1">
              {template.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2 mt-1">
              {template.description || 'Sin descripción'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <Layers className="h-3 w-3" />
            {moduleCount} módulo{moduleCount !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <ListChecks className="h-3 w-3" />
            {totalFields} campo{totalFields !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          className="w-full gap-2"
          size="sm"
          onClick={() => onAssign(template)}
        >
          <Send className="h-4 w-4" />
          Asignar formulario
        </Button>
      </CardFooter>
    </Card>
  );
}