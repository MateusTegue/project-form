'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface PublicFormSubmitterInfoProps {
  formData: Record<string, any>;
  onInputChange: (fieldKey: string, value: any) => void;
}

export default function PublicFormSubmitterInfo({ 
  formData, 
  onInputChange 
}: PublicFormSubmitterInfoProps) {
  return (
    <Card className="border-2 mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Remitente
        </CardTitle>
        <CardDescription>
          Información de la persona que está llenando el formulario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="submitter_name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="submitter_name"
              type="text"
              value={formData.submitter_name || ''}
              onChange={(e) => onInputChange('submitter_name', e.target.value)}
              placeholder="Ingrese su nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submitter_email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="submitter_email"
              type="email"
              value={formData.submitter_email || ''}
              onChange={(e) => onInputChange('submitter_email', e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submitter_phone">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="submitter_phone"
              type="tel"
              value={formData.submitter_phone || ''}
              onChange={(e) => onInputChange('submitter_phone', e.target.value)}
              placeholder="Ingrese su teléfono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submitter_document">
              Documento <span className="text-destructive">*</span>
            </Label>
            <Input
              id="submitter_document"
              type="text"
              value={formData.submitter_document || ''}
              onChange={(e) => onInputChange('submitter_document', e.target.value)}
              placeholder="Número de documento"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

