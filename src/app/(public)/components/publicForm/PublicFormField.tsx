'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PublicFormFieldProps } from '../../types/models';


export default function PublicFormField({ field, value, onChange }: PublicFormFieldProps) {
  const renderInput = () => {
    switch (field.fieldType) {
      case 'EMAIL':
        return (
          <Input
            id={field.fieldKey}
            type="email"
            required={field.isRequired}
            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="transition-all focus:ring-2 focus:ring-primary"
          />
        );

      case 'NUMBER':
        return (
          <Input
            id={field.fieldKey}
            type="number"
            required={field.isRequired}
            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="transition-all focus:ring-2 focus:ring-primary"
          />
        );

      case 'DATE':
        return (
          <Input
            id={field.fieldKey}
            type="date"
            required={field.isRequired}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="transition-all focus:ring-2 focus:ring-primary"
          />
        );

      case 'TEXTAREA':
        return (
          <Textarea
            id={field.fieldKey}
            required={field.isRequired}
            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="transition-all focus:ring-2 focus:ring-primary resize-none"
          />
        );

      case 'SELECT':
        // Asegurar que field.options sea un array válido
        let allOptions: any[] = []
        
        if (Array.isArray(field.options)) {
          allOptions = field.options
        } else if (field.options && typeof field.options === 'object') {
          // Si options es un objeto, intentar convertirlo a array
          allOptions = Object.values(field.options)
        }
        
        // Filtrar opciones activas (considerar activas si isActive es true, undefined o null)
        const activeSelectOptions = allOptions
          .filter((option: any) => {
            if (!option || typeof option !== 'object') return false
            // Considerar activa si isActive es true, undefined, null, o no existe
            return option.isActive !== false
          })
          .sort((a: any, b: any) => {
            const orderA = Number(a.displayOrder) || 0
            const orderB = Number(b.displayOrder) || 0
            return orderA - orderB
          })
          .filter((option: any) => {
            // Validar que tenga label y value
            return option.label && option.value
          })
        
        // Debug: solo en desarrollo
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && allOptions.length === 0 && field.fieldType === 'SELECT') {
          console.warn(`[PublicFormField] Campo SELECT "${field.label}" (${field.fieldKey}) no tiene opciones:`, {
            fieldKey: field.fieldKey,
            fieldType: field.fieldType,
            hasOptions: !!field.options,
            optionsType: typeof field.options,
            optionsIsArray: Array.isArray(field.options),
            optionsValue: field.options,
            allOptionsLength: allOptions.length,
            fieldKeys: field ? Object.keys(field) : []
          })
        }
        
        return (
          <Select
            value={value}
            onValueChange={onChange}
            required={field.isRequired}
            disabled={activeSelectOptions.length === 0}
          >
            <SelectTrigger id={field.fieldKey} className="w-full">
              <SelectValue 
                placeholder={activeSelectOptions.length > 0 
                  ? (field.placeholder || `Seleccione ${field.label.toLowerCase()}`)
                  : 'No hay opciones disponibles'}
                className="truncate"
              />
            </SelectTrigger>
            <SelectContent>
              {activeSelectOptions.length > 0 ? (
                activeSelectOptions.map((option: any, index: number) => {
                  const optionValue = String(option.value || option.id || `option-${index}`)
                  const optionLabel = String(option.label || optionValue)
                  
                  return (
                    <SelectItem key={option.id || option.value || `option-${index}`} value={optionValue} className="truncate">
                      <span className="truncate block">{optionLabel}</span>
                    </SelectItem>
                  )
                })
              ) : (
                <SelectItem value="no-options" disabled>No hay opciones disponibles</SelectItem>
              )}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            id={field.fieldKey}
            type="text"
            required={field.isRequired}
            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="transition-all focus:ring-2 focus:ring-primary"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.fieldKey} className="text-sm font-medium flex items-center gap-1 min-w-0" title={field.label}>
        <span className="truncate">{field.label}</span>
        {field.isRequired && (
          <span className="text-destructive shrink-0">*</span>
        )}
      </Label>
      {field.helpText && (
        <p className="text-xs text-muted-foreground line-clamp-2" title={field.helpText}>
          {field.helpText}
        </p>
      )}
      {renderInput()}
    </div>
  );
}