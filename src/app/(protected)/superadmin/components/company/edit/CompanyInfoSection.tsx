'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Building2 } from 'lucide-react';

interface CompanyInfoSectionProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CompanyInfoSection({ formData, onInputChange }: CompanyInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-gray-700">
          Datos de la Empresa
        </h3>
      </div>
      
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input 
            id="name"
            name="name" 
            value={formData.name} 
            onChange={onInputChange}
            placeholder="Nombre de la empresa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nit">NIT *</Label>
          <Input 
            id="nit"
            name="nit" 
            value={formData.nit} 
            onChange={onInputChange}
            placeholder="NIT de la empresa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="razonSocial">Razón Social</Label>
          <Input 
            id="razonSocial"
            name="razonSocial" 
            value={formData.razonSocial} 
            onChange={onInputChange}
            placeholder="Razón social"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input 
            id="country"
            name="country" 
            value={formData.country} 
            onChange={onInputChange}
            placeholder="País"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input 
            id="city"
            name="city" 
            value={formData.city} 
            onChange={onInputChange}
            placeholder="Ciudad"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input 
            id="address"
            name="address" 
            value={formData.address} 
            onChange={onInputChange}
            placeholder="Dirección"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input 
            id="logoUrl"
            name="logoUrl" 
            value={formData.logoUrl} 
            onChange={onInputChange}
            placeholder="URL del logo"
          />
        </div>
      </div>
    </div>
  );
}