'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, MapPin } from 'lucide-react';
import LogoCompany from '../../../../../public/logov1.png';
import { PublicFormHeaderProps } from '../../types/models';


export default function PublicFormHeader({ formName, companyName, companyLogo, companyLocation, welcomeMessage}: PublicFormHeaderProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-start gap-4">
          {/* Logo con fallback */}
          <div className="h-16 w-16 rounded-lg border overflow-hidden bg-white p-2 flex items-center justify-center">
            {companyLogo && !imageError ? (
              <img 
                src={companyLogo}
                alt={companyName || 'Logo de la empresa'}
                className="h-full w-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <Image
                src={LogoCompany}
                alt="Logo por defecto"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            )}
          </div>
          
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">
              {formName || 'Formulario'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{companyName || 'Empresa'}</span>
              {companyLocation && (
                <>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{companyLocation}</span>
                </>
              )}
            </CardDescription>
          </div>
        </div>
        
        {welcomeMessage && (
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-900">
              {welcomeMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
    </Card>
  );
}