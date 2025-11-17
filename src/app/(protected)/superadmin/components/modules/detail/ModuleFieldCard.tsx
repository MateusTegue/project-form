'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Hash, Type, ListChecks } from 'lucide-react';

interface ModuleFieldCardProps {
  field: any;
  index: number;
}

const fieldTypeIcons: Record<string, React.ReactNode> = {
  TEXT: <Type className="h-4 w-4" />,
  NUMBER: <Hash className="h-4 w-4" />,
  EMAIL: <Type className="h-4 w-4" />,
  SELECT: <ListChecks className="h-4 w-4" />,
  // Agrega más según necesites
};

export default function ModuleFieldCard({ field, index }: ModuleFieldCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          {/* Número del campo */}
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
            {index + 1}
          </div>

          {/* Contenido del campo */}
          <div className="flex-1 min-w-0">
            {/* Label y badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="font-medium text-base">{field.label}</h4>
              {field.isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Obligatorio
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {field.fieldKey}
              </code>
              
              <Badge variant="outline" className="text-xs gap-1">
                {fieldTypeIcons[field.fieldType] || <Type className="h-3 w-3" />}
                {field.fieldType}
              </Badge>

              {field.options && field.options.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {field.options.length} opción{field.options.length !== 1 ? 'es' : ''}
                </Badge>
              )}
            </div>

            {/* Help text */}
            {field.helpText && (
              <>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground">
                  ℹ️ {field.helpText}
                </p>
              </>
            )}

            {/* Placeholder */}
            {field.placeholder && (
              <p className="text-xs text-muted-foreground mt-1">
                Placeholder: "{field.placeholder}"
              </p>
            )}

            {/* Opciones (si es SELECT) */}
            {field.options && field.options.length > 0 && (
              <>
                <Separator className="my-2" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Opciones:</p>
                  <div className="flex flex-wrap gap-1">
                    {field.options.map((option: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}