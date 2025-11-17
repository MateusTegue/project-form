'use client';

import React from 'react';
import { useSuperAdminProfileEdit } from '@/hooks/profile/useSuperAdminProfileEdit';
import SuperAdminProfileHeader from './SuperAdminProfileHeader';
import SuperAdminProfileForm from './SuperAdminProfileForm';
import SuperAdminProfileSidebar from './SuperAdminProfileSidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function SuperAdminProfileEdit() {
  const {
    formData,
    isLoading,
    error,
    handleSubmit,
    register,
    formState,
    control,
    watch,
    setValue,
  } = useSuperAdminProfileEdit();

  return (
    <div className="container mx-auto min-h-screen p-6">
      <SuperAdminProfileHeader />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <SuperAdminProfileForm
            formData={formData}
            isLoading={isLoading}
            register={register}
            formState={formState}
            control={control}
            onSubmit={handleSubmit}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <div className="lg:w-80">
          <SuperAdminProfileSidebar formData={watch()} />
        </div>
      </div>
    </div>
  );
}