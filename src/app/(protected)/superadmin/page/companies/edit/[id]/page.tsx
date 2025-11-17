import React from 'react';
import CompanyEditPage from '@/app/(protected)/superadmin/components/company/edit/CompanyEditPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompanyEditPage params={{ id }} />;
}