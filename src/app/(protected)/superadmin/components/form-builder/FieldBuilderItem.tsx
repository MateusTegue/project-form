'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Settings2, Trash2, Lock } from 'lucide-react';
import { FormField } from '@/types/models';

interface FieldBuilderItemProps {
  field: FormField;
  index: number;
  readOnly: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function FieldBuilderItem({ 
  field, 
  index, 
  readOnly, 
  onEdit, 
  onDelete 
}: FieldBuilderItemProps) {
  return (
    <Card className={readOnly ? 'bg-gray-50' : ''}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {readOnly && <Lock className="h-3 w-3 text-muted-foreground" />}
              <p className="font-medium">{field.label}</p>
              {field.isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Obligatorio
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {field.fieldType}
              </Badge>
              {field.options && field.options.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {field.options.length} opción(es)
                </Badge>
              )}
            </div>
          </div>

          {!readOnly && (
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(index)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}