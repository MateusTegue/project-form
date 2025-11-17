'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CompanyInfoSection from './CompanyInfoSection';
import CompanyContactSection from './CompanyContactSection';
import CompanyEditActions from './CompanyEditActions';

interface CompanyEditFormProps {
  formData: any;
  company: any;
  saving: boolean;
  activating: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onActivate: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export default function CompanyEditForm({
  formData,
  company,
  saving,
  activating,
  onInputChange,
  onSave,
  onActivate,
  onDelete,
  onCancel
}: CompanyEditFormProps) {
  return (
    <Card className="hidden md:block">
      <CardContent className="pt-2 space-y-6">
        <CompanyInfoSection 
          formData={formData}
          onInputChange={onInputChange}
        />

        <CompanyContactSection
          formData={formData}
          onInputChange={onInputChange}
        />

        <CompanyEditActions
          company={company}
          saving={saving}
          activating={activating}
          onSave={onSave}
          onActivate={onActivate}
          onDelete={onDelete}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
}