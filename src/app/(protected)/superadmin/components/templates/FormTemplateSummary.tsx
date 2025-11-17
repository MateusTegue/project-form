'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FormTemplateTypeEnum, FormModule } from '@/types/models';
import { FileText, Layers, ListChecks } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Props {
  name: string;
  description?: string;
  templateType: FormTemplateTypeEnum;
  modules: FormModule[];
}

export default function FormTemplateSummary({ name, description, templateType, modules }: Props) {
  const totalFields = modules.reduce((sum, mod) => sum + (mod.fields?.length || 0), 0);
  const requiredModules = modules.filter(m => m.isRequired).length;

  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-md text-primary font-bold">
            <FileText className="h-5 w-5" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-md text-primary font-bold">Nombre</p>
            <p className="text-md text-primary">{name}</p>
          </div>
          <Separator />
          <div>
            <p className="text-md text-primary font-bold">Tipo</p>
            <Badge variant="secondary">{templateType}</Badge>
          </div>
          {description && (
            <>
              <Separator />
              <div>
                <p className="text-md text-primary font-bold">Descripción</p>
                <p className="text-md text-primary">{description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
           Cantidad de módulos ({modules.length})
          </CardTitle>
        </CardHeader>
        <CardContent className='m-0'>
          {modules.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay módulos para mostrar
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {modules.map((module, index) => (
                <AccordionItem key={index} value={`module-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 w-full pr-4">
                      <span className="font-semibold">
                        {index + 1}. {module.name}
                      </span>
                      <Badge 
                        variant={module.isRequired ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {module.isRequired ? 'Obligatorio' : 'Opcional'}
                      </Badge>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {module.fields?.length || 0} campo(s)
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {/* Clave del módulo */}
                      <div>
                        <p className="text-xs text-muted-foreground">Clave del módulo:</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {module.moduleKey}
                        </code>
                      </div>

                      {/* Descripción */}
                      {module.description && (
                        <div>
                          <p className="text-xs text-muted-foreground">Descripción:</p>
                          <p className="text-sm">{module.description}</p>
                        </div>
                      )}

                      <Separator />

                      {/* Campos del módulo */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Campos:</p>
                        <div className="space-y-2">
                          {module.fields && module.fields.length > 0 ? (
                            module.fields.map((field, fIndex) => (
                              <div 
                                key={fIndex} 
                                className="flex items-center gap-2 text-sm pl-2 py-1 rounded-md hover:bg-muted/50"
                              >
                                <ListChecks className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="flex-1">{field.label}</span>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <Badge variant="outline" className="text-xs">
                                    {field.fieldType}
                                  </Badge>
                                  {field.isRequired && (
                                    <span className="text-destructive text-xs font-bold">*</span>
                                  )}
                                  {field.options && field.options.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      ({field.options.length} opciones)
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Sin campos definidos
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      
    </div>
  );
}