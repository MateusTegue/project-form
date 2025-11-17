'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FormFieldRendererProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function FormFieldRenderer({ field, value, onChange, error }: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.fieldType) {
      case 'TEXT':
        return (
          <Input
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'TEXTAREA':
        return (
          <Textarea
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'NUMBER':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={field.validations?.min}
            max={field.validations?.max}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'EMAIL':
        return (
          <Input
            type="email"
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'PHONE':
        return (
          <Input
            type="tel"
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'DATE':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!value && 'text-muted-foreground'} ${error && 'border-destructive'}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'PPP', { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date?.toISOString())}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        );

      case 'SELECT':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={field.placeholder || 'Seleccionar...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'RADIO':
        return (
          <RadioGroup value={value || ''} onValueChange={onChange}>
            {field.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.fieldKey}-${option.value}`} />
                <Label htmlFor={`${field.fieldKey}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'CHECKBOX':
        return (
          <div className="space-y-2">
            {field.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.fieldKey}-${option.value}`}
                  checked={value?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = value || [];
                    if (checked) {
                      onChange([...newValue, option.value]);
                    } else {
                      onChange(newValue.filter((v: string) => v !== option.value));
                    }
                  }}
                />
                <Label htmlFor={`${field.fieldKey}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'FILE':
        return (
          <Input
            type="file"
            onChange={(e) => onChange(e.target.files?.[0])}
            accept={field.validations?.fileTypes?.map((t: string) => `.${t}`).join(',')}
            className={error ? 'border-destructive' : ''}
          />
        );

      default:
        return (
          <Input
            placeholder={field.placeholder || ''}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.fieldKey}>
        {field.label}
        {field.isRequired && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}