'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDeleteModule } from '../../../hook/modules/useDeleteModule';
import { useGetAllModules } from '../../../hook/modules/useGetAllModules';

interface ModuleDeleteDialogProps {
  moduleId: string;
  moduleName: string;
}

export default function ModuleDeleteDialog({ moduleId, moduleName }: ModuleDeleteDialogProps) {
  const router = useRouter();
  const { deleteModule, isLoading } = useDeleteModule();
  const { refetch } = useGetAllModules();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const success = await deleteModule(moduleId);
    
    if (success) {
      setOpen(false);
      // Refrescar la lista de módulos
      await refetch();
      // Redirigir a la lista de módulos
      router.push('/superadmin/page/modules');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>¿Eliminar módulo?</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                Estás a punto de eliminar el módulo <strong>"{moduleName}"</strong>.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <p className="font-medium mb-2">Advertencia</p>
          <ul className="space-y-1 text-xs list-disc list-inside">
            <li>Esta acción no se puede deshacer</li>
            <li>Si el módulo está asignado a formularios, se desactivará en lugar de eliminarse</li>
            <li>Si no está asignado, se eliminará permanentemente junto con sus campos</li>
          </ul>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Sí, eliminar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}