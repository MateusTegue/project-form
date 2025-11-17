'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layers, Loader2 } from 'lucide-react';
import ModuleDetailMetadata from './ModuleDetailMetadata';
import { useUpdateModule } from '../../../hook/modules/useUpdateModule';
import { useGetAllModules } from '../../../hook/modules/useGetAllModules';
import toast from 'react-hot-toast';

interface ModuleDetailInfoProps {
  module: any;
}

export default function ModuleDetailInfo({ module }: ModuleDetailInfoProps) {
  const { updateModule, isLoading } = useUpdateModule();
  const { refetch } = useGetAllModules();
  const [isActive, setIsActive] = useState(module.isActive ?? true);

  // Sincronizar el estado cuando cambie el módulo
  useEffect(() => {
    setIsActive(module.isActive ?? true);
  }, [module.isActive]);

  const handleToggleActive = async (checked: boolean) => {
    setIsActive(checked);
    
    const success = await updateModule(module.id, { isActive: checked });
    
    if (success) {
      await refetch();
      toast.success(`Módulo ${checked ? 'activado' : 'desactivado'} correctamente`);
    } else {
      // Revertir el estado si falla
      setIsActive(!checked);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{module.name}</CardTitle>
              <CardDescription className="mt-2">
                {module.description || 'Sin descripción disponible'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Label htmlFor="module-active" className="text-sm font-medium">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  isActive ? 'Activo' : 'Inactivo'
                )}
              </Label>
              <Switch
                id="module-active"
                checked={isActive}
                onCheckedChange={handleToggleActive}
                disabled={isLoading}
              />
            </div>
            <Badge variant={isActive ? 'default' : 'secondary'} className="shrink-0">
              {isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ModuleDetailMetadata module={module} />
      </CardContent>
    </Card>
  );
}