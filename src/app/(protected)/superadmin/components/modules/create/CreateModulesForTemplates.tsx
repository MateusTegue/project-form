'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { createModuleSchema, TypeCreateModuleSchema } from '../../../schemas/createSchemas';
import { useCreateModule } from '../../../hook/modules/useCreateModules';
import { FormModule, FormField, FieldTypeEnum, FieldOption } from '@/types/models';
import { getModuleByKey } from '@/utils/modulesAndFieldsData';
import ModuleFormHeader from './ModuleCreationHeader';
import ModuleBasicInfoCard from './ModuleBasicInfoCard';
import ModuleFieldsCard from './ModuleFieldsCard';
import ModuleFormSummary from './ModuleCreationSummary';
import ModuleFormProgress from './ModuleCreationProgress';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/^_+|_+$/g, '');
}

interface CreateModulesForTemplatesProps {
  modules?: FormModule[];
  onModulesChange?: (modules: FormModule[]) => void;
}

export default function CreateModulesForTemplates({ modules = [], onModulesChange }: CreateModulesForTemplatesProps) {
  const [fields, setFields] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0); // 0: Info básica, 1: Campos
  const { createModule, isLoading } = useCreateModule();

  const form = useForm<TypeCreateModuleSchema>({
    resolver: zodResolver(createModuleSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      moduleKey: '',
      isActive: true,
      fields: []
    }
  });

  const watchName = form.watch('name');
  const watchModuleKey = form.watch('moduleKey');

  // Auto-generar slug
  useEffect(() => {
    if (watchName) {
      const slug = generateSlug(watchName);
      form.setValue('moduleKey', slug);
    }
  }, [watchName, form]);

  // Sincronizar campos
  useEffect(() => {
    form.setValue('fields', fields);
  }, [fields, form]);

  // Validaciones para permitir siguiente paso
  const canProceedToFields = Boolean(watchName?.trim()) && Boolean(watchModuleKey?.trim());
  const canSubmit = canProceedToFields && fields.length > 0;

  const handleNextStep = () => {
    if (currentStep === 0 && canProceedToFields) {
      // Si hay un moduleKey seleccionado, cargar automáticamente los campos del módulo
      if (watchModuleKey) {
        const selectedModule = getModuleByKey(watchModuleKey);
        if (selectedModule && selectedModule.fields && selectedModule.fields.length > 0) {
          // Mapear los campos del JSON al formato FormField
          const mappedFields: FormField[] = selectedModule.fields.map((field, index) => {
            // Mapear las opciones si existen
            let options: FieldOption[] | undefined = undefined;
            if (field.options && field.options.length > 0) {
              options = field.options.map((opt, optIndex) => ({
                id: `option_${Date.now()}_${index}_${optIndex}_${Math.random().toString(36).substr(2, 9)}`,
                label: opt.label,
                value: opt.value,
                displayOrder: opt.displayOrder,
                isActive: opt.isActive
              }));
            }

            return {
              id: `field_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
              label: field.label,
              fieldKey: field.fieldKey,
              fieldType: field.fieldType as FieldTypeEnum,
              placeholder: '',
              helpText: '',
              isRequired: false,
              displayOrder: index,
              isActive: true,
              options: options
            };
          });
          
          setFields(mappedFields);
        }
      }
      setCurrentStep(1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: TypeCreateModuleSchema) => {
    const result = await createModule(data);

    if (result.success) {
      // Si hay onModulesChange, agregar el módulo creado a la lista
      if (onModulesChange) {
        const newModule: FormModule = {
          id: result.data?.id || '',
          name: data.name,
          description: data.description || '',
          moduleKey: data.moduleKey,
          isActive: data.isActive ?? true,
          fields: fields,
          displayOrder: modules.length,
          isRequired: false
        };
        onModulesChange([...modules, newModule]);
      }
      
      form.reset();
      setFields([]);
      setCurrentStep(0);
    } else {
    }
  };

  const totalSteps = 2;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="max-w-4xl bg-white border rounded-2xl shadow-xl p-6 mx-auto space-y-6">
        <ModuleFormHeader 
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={currentStep > 0 ? handlePreviousStep : undefined}
        />

        <ModuleFormProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        />

        <Form {...form}>
          <div className="space-y-6">
            {/* Paso 1: Información Básica */}
            {currentStep === 0 && (
              <ModuleBasicInfoCard 
                form={form}
                onNext={handleNextStep}
                canProceed={canProceedToFields}
              />
            )}

            {/* Paso 2: Campos del Módulo */}
            {currentStep === 1 && (
              <>
                <ModuleFieldsCard
                  form={form}
                  fields={fields}
                  onFieldsChange={setFields}
                />

                <Separator />

                <ModuleFormSummary
                  fieldsCount={fields.length}
                  canSubmit={canSubmit}
                  isLoading={isLoading}
                  onBack={handlePreviousStep}
                  onSubmit={() => form.handleSubmit(onSubmit)()}
                />
              </>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}