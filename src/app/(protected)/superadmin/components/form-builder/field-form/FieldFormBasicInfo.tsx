'use client';

import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FieldTypeEnum, FieldOption } from '@/types/models';
import { generateFieldKey } from '../../../utils/fieldKeyGenerator';
import { Combobox } from '@/components/ui/combobox';
import { getAllFieldOptions, getFieldByKey, getFieldOptionsForModule } from '@/utils/modulesAndFieldsData';

interface FieldFormBasicInfoProps {
  fieldForm: Partial<FormField>;
  setFieldForm: (form: Partial<FormField>) => void;
  errors: { [key: string]: string };
  moduleKey?: string;
}

export default function FieldFormBasicInfo({ 
  fieldForm, 
  setFieldForm, 
  errors,
  moduleKey
}: FieldFormBasicInfoProps) {
  
  // Obtener opciones de campos predefinidos según el módulo seleccionado
  const fieldOptions = useMemo(() => {
    if (moduleKey) {
      return getFieldOptionsForModule(moduleKey);
    }
    return getAllFieldOptions();
  }, [moduleKey]);
  
  const handleLabelChange = (value: string) => {
    const generatedKey = generateFieldKey(value);
    setFieldForm({
      ...fieldForm,
      label: value,
      fieldKey: generatedKey
    });
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="label">Etiqueta *</Label>
        <div className="space-y-2">
          <Combobox
            options={fieldOptions}
            value={fieldForm.fieldKey || ""}
            onValueChange={(fieldKey) => {
              if (fieldKey) {
                const selectedField = getFieldByKey(fieldKey);
                if (selectedField) {
                  const generatedKey = generateFieldKey(selectedField.label);
                  
                  // Si el campo tiene opciones predefinidas, cargarlas automáticamente
                  let options: FieldOption[] | undefined = undefined;
                  if (selectedField.options && selectedField.options.length > 0) {
                    options = selectedField.options.map((opt, index) => ({
                      id: `option_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
                      label: opt.label,
                      value: opt.value,
                      displayOrder: opt.displayOrder,
                      isActive: opt.isActive
                    }));
                  }
                  
                  setFieldForm({
                    ...fieldForm,
                    label: selectedField.label,
                    fieldKey: generatedKey,
                    fieldType: selectedField.fieldType as FieldTypeEnum,
                    options: options
                  });
                }
              }
            }}
            placeholder="Buscar o seleccionar campo predefinido..."
            searchPlaceholder="Buscar campo..."
            emptyMessage="No se encontraron campos predefinidos."
          />
        </div>
        {errors.label && (
          <p className="text-sm text-red-500">{errors.label}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fieldType">Tipo de Campo *</Label>
        <Select 
          value={fieldForm.fieldType} 
          onValueChange={(value) => setFieldForm({ 
            ...fieldForm, 
            fieldType: value as FieldTypeEnum 
          })}
        >
          <SelectTrigger id="fieldType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FieldTypeEnum).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input 
          id="placeholder" 
          value={fieldForm.placeholder || ''} 
          onChange={(e) => setFieldForm({ 
            ...fieldForm, 
            placeholder: e.target.value 
          })} 
          placeholder="Texto de ayuda..." 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="helpText">Texto de Ayuda</Label>
        <Textarea 
          id="helpText" 
          value={fieldForm.helpText || ''} 
          onChange={(e) => setFieldForm({ 
            ...fieldForm, 
            helpText: e.target.value 
          })} 
          placeholder="Información adicional para el usuario..." 
          rows={2} 
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <Label htmlFor="isRequired">¿Es obligatorio?</Label>
        <Switch 
          id="isRequired" 
          checked={fieldForm.isRequired} 
          onCheckedChange={(checked) => setFieldForm({ 
            ...fieldForm, 
            isRequired: checked 
          })} 
        />
      </div>
    </>
  );
}