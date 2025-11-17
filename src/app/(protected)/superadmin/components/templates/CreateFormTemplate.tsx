'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Save, FileText, CheckCircle2, Layers, Info } from 'lucide-react';
import { createFormtemplateSchema, CreateFormtemplateInput } from '../../schemas/formtemplate';
import { useCreateFormtemplate } from '../../hook/formtemplate/useCreateFormtemplate';
import { FormTemplateTypeEnum, FormModule } from '@/types/models';
import SelectModulesForTemplate from './SelectModulesForTemplate';
import FormTemplateSummary from './FormTemplateSummary';

export default function FormTemplateBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [modules, setModules] = useState<FormModule[]>([]);
  const { createFormtemplate, isLoading } = useCreateFormtemplate();

  const form = useForm<CreateFormtemplateInput>({
    resolver: zodResolver(createFormtemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      templateType: FormTemplateTypeEnum.TERCERO_GENERAL,
      modules: []
    }
  });

  const watchName = form.watch('name');
  const watchTemplateType = form.watch('templateType');

  const onSubmit = async (data: CreateFormtemplateInput) => {
    
    const result = await createFormtemplate({
      ...data,
      modules
    });

    if (result.success) {
      form.reset();
      setModules([]);
      setActiveStep(0);
    }
  };

  const canGoToStep2 = Boolean(watchName?.trim()) && Boolean(watchTemplateType);
  const canGoToStep3 = modules.length > 0;

  const steps = [
    {
      number: 1,
      title: 'Información Básica',
      description: 'Datos generales del formulario',
      icon: Info,
      completed: canGoToStep2
    },
    {
      number: 2,
      title: 'Módulos y Campos',
      description: 'Estructura del formulario',
      icon: Layers,
      completed: canGoToStep3
    },
    {
      number: 3,
      title: 'Resumen',
      description: 'Verificar y crear',
      icon: CheckCircle2,
      completed: false
    }
  ];

  return (
    <div className="w-full ">
      <div className="max-w-7xl bg-white border rounded-2xl shadow-xl p-4 mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-md font-bold tracking-tight flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Crear Formulario
            </h1>
            <p className="text-muted-foreground mt-2">
              Configura tu formulario en 3 pasos simples
            </p>
          </div>
          <Badge variant="outline" className="text-sm py-2 px-4">
            Paso {activeStep + 1} de 3
          </Badge>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = activeStep === index;
                  const isCompleted = step.completed;
                  const isPast = activeStep > index;

                  return (
                    <li key={step.number} className="relative flex-1">
                      <div className="flex items-center">
                        <button
                          type="button" 
                          onClick={() => {
                            if (index < activeStep || (index === 1 && canGoToStep2) || (index === 2 && canGoToStep3)) {
                              setActiveStep(index);
                            }
                          }}
                          disabled={
                            (index === 1 && !canGoToStep2) ||
                            (index === 2 && !canGoToStep3)
                          }
                          className="relative"
                        >
                          <div
                            className={`
                              flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                              ${
                                isActive
                                  ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-110'
                                  : isPast || isCompleted
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-muted bg-background text-muted-foreground'
                              }
                            `}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </button>

                        <div className="ml-4 flex-1">
                          <p
                            className={`text-sm font-semibold ${
                              isActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`
                              absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 transition-colors
                              ${isPast ? 'bg-primary' : 'bg-muted'}
                            `}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {activeStep === 0 && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                  <CardDescription>
                    Proporciona los detalles generales del formulario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Formulario</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Registro de Proveedores 2025"
                            className="text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="templateType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Formulario</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Seleccione un tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={FormTemplateTypeEnum.PROVEEDOR}>
                              🏢 Proveedor
                            </SelectItem>
                            <SelectItem value={FormTemplateTypeEnum.CLIENTE}>
                              👤 Cliente
                            </SelectItem>
                            <SelectItem value={FormTemplateTypeEnum.TERCERO_GENERAL}>
                              📋 Tercero General
                            </SelectItem>
                            <SelectItem value={FormTemplateTypeEnum.PERSONALIZADO}>
                              ⚙️ Personalizado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe el propósito y uso de este formulario..."
                            className="resize-none text-base"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => {
                        if (canGoToStep2) {
                          setActiveStep(1);
                        }
                      }}
                      disabled={!canGoToStep2}
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <Card className="border-2">
                  <CardContent>
                    <SelectModulesForTemplate 
                      selectedModules={modules} 
                      onModulesChange={setModules} 
                    />
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setActiveStep(0)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        onClick={() => setActiveStep(2)}
                        disabled={!canGoToStep3}
                      >
                        Continuar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Resumen */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Resumen del Formulario
                    </CardTitle>
                    <CardDescription>
                      Revisa la configuración antes de crear el formulario
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormTemplateSummary
                      name={form.getValues('name')}
                      description={form.getValues('description')}
                      templateType={form.getValues('templateType')}
                      modules={modules}
                    />
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setActiveStep(1)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Anterior
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading || modules.length === 0}
                        className="min-w-[200px]"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Creando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Crear Formulario
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}