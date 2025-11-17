'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, CheckCircle, X } from 'lucide-react';
import DeleteCompanyButton from '@/app/(protected)/superadmin/components/company/DeleteCompanyButton';

interface CompanyEditActionsProps {
  company: any;
  saving: boolean;
  activating: boolean;
  onSave: () => void;
  onActivate: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export default function CompanyEditActions({
  company,
  saving,
  activating = false,
  onSave,
  onActivate,
  onDelete,
  onCancel
}: CompanyEditActionsProps) {
  const router = useRouter();
  const isActive = company?.status === "Activo";

  return (
    <div className="space-y-4">
      <Separator />
      
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={onSave || activating} 
          disabled={saving} 
          className="flex-1 gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>

        {isActive ? (
          <DeleteCompanyButton 
            company={company} 
            onSuccess={onDelete} 
            variant="icon" 
            size="default"
          />
        ) : (
          <Button 
            onClick={onActivate}
            disabled={activating || saving} 
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Activar
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => router.push("/superadmin/page/companies")}
          disabled={saving}
          className="gap-2"
        >
            <X className="h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </div>
  );
}

