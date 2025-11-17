'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import SuperAdminProfileInfo from './SuperAdminProfileInfo';
import SuperAdminProfileContact from './SuperAdminProfileContact';
import { UseFormRegister, UseFormStateReturn, UseFormSetValue, UseFormWatch, Control } from 'react-hook-form';
import { UpdateProfileSchema } from '@/lib/validations';

interface SuperAdminProfileFormProps {
  formData: any;
  isLoading: boolean;
  register: UseFormRegister<UpdateProfileSchema>;
  formState: UseFormStateReturn<UpdateProfileSchema>;
  control: Control<UpdateProfileSchema>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  setValue: UseFormSetValue<UpdateProfileSchema>;
  watch: UseFormWatch<UpdateProfileSchema>;
}

export default function SuperAdminProfileForm({
  formData,
  isLoading,
  register,
  formState,
  control,
  onSubmit,
  setValue,
  watch,
}: SuperAdminProfileFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader className="">
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <SuperAdminProfileInfo
            formData={formData}
            register={register}
            errors={formState.errors}
          />

          <SuperAdminProfileContact
            formData={formData}
            register={register}
            errors={formState.errors}
            control={control}
            setValue={setValue}
            watch={watch}
          />

          <Button
            type="submit"
            disabled={isLoading || !formState.isDirty}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}