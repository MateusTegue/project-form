'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ShareLinkForm from '../shareLinkForm/SharedLinkForm';
import type { AssignedFormCardProps } from '../../types/models';


const AssignedFormCard: React.FC<AssignedFormCardProps> = ({ assignment }) => {
  const formattedDate = new Date(assignment.created_at).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="w-[400px] hover:shadow-lg  transition-all duration-300 hover:border-primary/50 group ">
      <CardHeader className="">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base leading-tight mb-1 line-clamp-2">
                {assignment.name}
              </CardTitle>
              <div className="flex items-center gap-2 ">
                <Badge variant="secondary" className="text-xs">
                  {assignment.templateType}
                </Badge>
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Asignado: {formattedDate}</span>
        </div>

        {assignment.publicToken && (
          <ShareLinkForm 
            token={assignment.publicToken} 
            formName={assignment.name}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AssignedFormCard;
