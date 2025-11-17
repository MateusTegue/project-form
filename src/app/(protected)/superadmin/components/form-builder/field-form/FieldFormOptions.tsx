'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { FormField, FieldOption } from '@/types/models';
import FieldFormOptionItem from './FieldFormOptionItem';

interface FieldFormOptionsProps {
  fieldForm: Partial<FormField>;
  setFieldForm: (form: Partial<FormField>) => void;
  errors: { [key: string]: string };
}

export default function FieldFormOptions({ 
  fieldForm, 
  setFieldForm, 
  errors 
}: FieldFormOptionsProps) {
  
  const handleAddOption = () => {
    const newOptions = [
      ...(fieldForm.options || []),
      {
        id: `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: '',
        value: '',
        displayOrder: (fieldForm.options?.length || 0) + 1,
        isActive: true
      }
    ];
    setFieldForm({ ...fieldForm, options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = fieldForm.options?.filter((_, i) => i !== index) || [];
    setFieldForm({ ...fieldForm, options: newOptions });
  };

  const handleOptionChange = (index: number, key: keyof FieldOption, value: any) => {
    const newOptions = [...(fieldForm.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    setFieldForm({ ...fieldForm, options: newOptions });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Opciones *</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddOption}
        >
          <Plus className="h-3 w-3 mr-1" />
          Agregar Opción
        </Button>
      </div>

      {errors.options && (
        <p className="text-sm text-red-500">{errors.options}</p>
      )}

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {fieldForm.options?.map((option, index) => (
          <FieldFormOptionItem
            key={index}
            option={option}
            index={index}
            onChange={handleOptionChange}
            onRemove={handleRemoveOption}
          />
        ))}
      </div>

      {(!fieldForm.options || fieldForm.options.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay opciones. Haz clic en "Agregar Opción"
        </p>
      )}
    </div>
  );
}