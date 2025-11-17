'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import FormTemplateCardHeader from './FormTemplateCardHeader';
import FormTemplateCardContent from './FormTemplateCardContent';
import type { FormTemplate } from './FormTemplatesGrid';

interface FormTemplateCardProps {
  template: FormTemplate;
}

export default function FormTemplateCard({ template }: FormTemplateCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/superadmin/page/formstemplates/edit/${template.id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      <FormTemplateCardHeader template={template} />
      <FormTemplateCardContent template={template} />
    </Card>
  );
}

