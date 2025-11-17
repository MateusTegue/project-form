'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { UpdateProfileSchema } from '@/lib/validations';

interface SuperAdminProfileInfoProps {
  formData: any;
  register: UseFormRegister<UpdateProfileSchema>;
  errors: FieldErrors<UpdateProfileSchema>;
}

export default function SuperAdminProfileInfo({ 
  formData, 
  register, 
  errors 
}: SuperAdminProfileInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Información Personal</h3>
      </div>
      
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Primer Nombre {errors.firstName && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Tu primer nombre"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstMiddleName">
            Primer Apellido {errors.firstMiddleName && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </Label>
          <Input
            id="firstMiddleName"
            {...register('firstMiddleName')}
            placeholder="Tu primer apellido"
            className={errors.firstMiddleName ? 'border-red-500' : ''}
          />
          {errors.firstMiddleName && (
            <p className="text-sm text-red-500">{errors.firstMiddleName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">
          Nombre de Usuario {errors.username && (
            <span className="text-red-500 text-sm">*</span>
          )}
        </Label>
        <Input
          id="username"
          {...register('username')}
          placeholder="tu_usuario"
          className={errors.username ? 'border-red-500' : ''}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>
    </div>
  );
}