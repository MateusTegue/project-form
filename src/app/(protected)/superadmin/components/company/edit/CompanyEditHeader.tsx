'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building2 } from 'lucide-react';

interface CompanyEditHeaderProps {
  companyName?: string;
  logoUrl?: string;
}

export default function CompanyEditHeader({ companyName, logoUrl }: CompanyEditHeaderProps) {
  return (
    <div className="w-full h-16  fixed flex justify-between items-center px-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold text-gray-700">Gestión de Compañías</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold">{companyName || 'Compañía'}</h2>
        <Avatar className="h-12 w-12">
          <AvatarImage src={logoUrl} alt={companyName} />
          <AvatarFallback>
            <Building2 className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}