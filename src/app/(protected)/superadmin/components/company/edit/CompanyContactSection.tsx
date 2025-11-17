'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';

interface CompanyContactSectionProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CompanyContactSection({ formData, onInputChange }: CompanyContactSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-gray-700">
          Datos de Contacto
        </h3>
      </div>
      
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactFirstName">Nombre</Label>
          <Input 
            id="contactFirstName"
            name="contactFirstName" 
            value={formData.contactFirstName} 
            onChange={onInputChange}
            placeholder="Nombre del contacto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactLastName">Apellido</Label>
          <Input 
            id="contactLastName"
            name="contactLastName" 
            value={formData.contactLastName} 
            onChange={onInputChange}
            placeholder="Apellido del contacto"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="contactEmail">Email *</Label>
          <Input 
            id="contactEmail"
            name="contactEmail" 
            type="email"
            value={formData.contactEmail} 
            onChange={onInputChange}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="contactPhone">Teléfono</Label>
          <div className="flex gap-2">
            <Input
              name="contactPhoneCountryCode"
              value={formData.contactPhoneCountryCode}
              onChange={onInputChange}
              className="w-24"
              placeholder="+57"
            />
            <Input 
              id="contactPhone"
              name="contactPhone" 
              value={formData.contactPhone} 
              onChange={onInputChange}
              placeholder="3001234567"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}