'use client';

import React from 'react';
import AssignedFormItem from '../assignedForms/AssignedFormItem';

interface CompanyFormsContentProps {
  companyId: string;
  companyName: string;
}

export default function CompanyFormsContent({ 
  companyId, 
  companyName 
}: CompanyFormsContentProps) {
  return (
    <main className="container mx-auto">
       <AssignedFormItem 
        companyId={companyId}
        companyName={companyName}
      />
    </main>
  );
}