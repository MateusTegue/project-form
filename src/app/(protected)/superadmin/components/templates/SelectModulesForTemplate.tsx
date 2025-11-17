'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Layers, FileText, CheckCircle2 } from 'lucide-react';
import { FormModule } from '@/types/models';
import { useGetAllModules, Module } from '../../hook/modules/useGetAllModules';

interface SelectModulesForTemplateProps {
  selectedModules: FormModule[];
  onModulesChange: (modules: FormModule[]) => void;
}

export default function SelectModulesForTemplate({ 
  selectedModules, 
  onModulesChange 
}: SelectModulesForTemplateProps) {
  const { modules, loading } = useGetAllModules();
  
  // Calcular los IDs seleccionados directamente desde selectedModules
  // No usar useMemo aquí para evitar problemas con dependencias que cambian
  const getSelectedModuleIds = () => {
    return new Set(selectedModules.map(m => m.moduleId));
  };

  const handleToggleModule = (module: Module) => {
    const currentSelectedIds = new Set(selectedModules.map(m => m.moduleId));
    const newSelectedIds = new Set(currentSelectedIds);
    
    if (newSelectedIds.has(module.id)) {
      newSelectedIds.delete(module.id);
    } else {
      newSelectedIds.add(module.id);
    }
    
    // Actualizar la lista de módulos seleccionados, mapeando Module a FormModule
    const updatedModules: FormModule[] = modules
      .filter(m => newSelectedIds.has(m.id))
      .map((m, index) => ({
        moduleId: m.id,
        name: m.name,
        description: m.description || '',
        moduleKey: m.moduleKey,
        isActive: m.isActive,
        fields: m.fields || [],
        displayOrder: index,
        isRequired: false
      }));
    onModulesChange(updatedModules);
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <span className="animate-spin mr-2">⏳</span>
              Cargando módulos...
            </div>
          </CardContent>
        </Card>
      ) : modules.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay módulos creados. Por favor, crea módulos primero desde la sección de gestión de módulos.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {modules.map((module) => {
            const selectedModuleIds = getSelectedModuleIds();
            const isSelected = selectedModuleIds.has(module.id);
            const fieldsCount = module.fields?.length || 0;
            
            return (
              <Card 
                key={module.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => handleToggleModule(module)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleModule(module)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base flex items-center gap-2">
                            {module.name}
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </h4>
                          {module.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {module.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-3">
                            <Badge variant="secondary" className="text-xs">
                              {fieldsCount} campo{fieldsCount !== 1 ? 's' : ''}
                            </Badge>
                            <Badge 
                              variant={module.isActive ? "default" : "outline"} 
                              className="text-xs"
                            >
                              {module.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedModules.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">
                {selectedModules.length} módulo{selectedModules.length !== 1 ? 's' : ''} seleccionado{selectedModules.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

