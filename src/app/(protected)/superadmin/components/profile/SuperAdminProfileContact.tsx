'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch, Controller, Control } from 'react-hook-form';
import { UpdateProfileSchema } from '@/lib/validations';

interface SuperAdminProfileContactProps {
  formData: any;
  register: UseFormRegister<UpdateProfileSchema>;
  errors: FieldErrors<UpdateProfileSchema>;
  control: Control<UpdateProfileSchema>;
  setValue?: UseFormSetValue<UpdateProfileSchema>;
  watch?: UseFormWatch<UpdateProfileSchema>;
}

export default function SuperAdminProfileContact({ 
  formData, 
  register, 
  errors,
  control,
  setValue,
  watch
}: SuperAdminProfileContactProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Información de Contacto</h3>
      </div>
      
      <Separator />

      <div className="space-y-2">
        <Label htmlFor="email">
          Correo Electrónico {errors.email && (
            <span className="text-red-500 text-sm">*</span>
          )}
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="tu@email.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="codePhone">
            Código de País {errors.codePhone && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </Label>
          <Controller
            name="codePhone"
            control={control}
            defaultValue={formData.codePhone || '+57'}
            render={({ field }) => (
              <Select
                value={field.value || '+57'}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
              >
                <SelectTrigger 
                  id="codePhone" 
                  className={errors.codePhone ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Seleccionar código" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+57">+57 Colombia</SelectItem>
                  <SelectItem value="+1">+1 USA</SelectItem>
                  <SelectItem value="+34">+34 España</SelectItem>
                  <SelectItem value="+52">+52 México</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.codePhone && (
            <p className="text-sm text-red-500">{errors.codePhone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Teléfono {errors.phone && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="300 123 4567"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}