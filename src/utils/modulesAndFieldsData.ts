'use client';

import { ComboboxOption } from '@/components/ui/combobox';
import { FieldTypeEnum } from '@/types/models';

// Importar el JSON
import modulesAndFieldsDataJson from '@/data/modules-and-fields.json';

// Asegurar que el tipo sea correcto
const modulesAndFieldsData: { modules: ModuleDefinition[] } = modulesAndFieldsDataJson as { modules: ModuleDefinition[] };

export interface ModuleDefinition {
  name: string;
  moduleKey: string;
  description: string;
  fields: FieldDefinition[];
}

export interface FieldOption {
  label: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

export interface FieldDefinition {
  label: string;
  fieldKey: string;
  fieldType: string;
  options?: FieldOption[];
}

// Cargar datos de módulos
export const getModulesData = (): ModuleDefinition[] => {
  if (!modulesAndFieldsData || !modulesAndFieldsData.modules) {
    return [];
  }
  return modulesAndFieldsData.modules as ModuleDefinition[];
};

// Obtener opciones de módulos para el Combobox
export const getModuleOptions = (): ComboboxOption[] => {
  try {
    // Verificar que modulesAndFieldsData esté definido
    if (!modulesAndFieldsData) {
      return [];
    }
    
    // Verificar que tenga la propiedad modules
    if (!modulesAndFieldsData.modules) {
      return [];
    }
    
    const modules = modulesAndFieldsData.modules;
    
    // Verificar que sea un array y tenga elementos
    if (!Array.isArray(modules) || modules.length === 0) {
      return [];
    }
    
    // Mapear los módulos a opciones del Combobox
    return modules.map(module => ({
      value: module.moduleKey || '',
      label: module.name || '',
      description: module.description || ''
    }));
  } catch (error) {
    return [];
  }
};

// Obtener opciones de campos para un módulo específico
export const getFieldOptionsForModule = (moduleKey: string): ComboboxOption[] => {
  const modules = getModulesData();
  const module = modules.find(m => m.moduleKey === moduleKey);
  
  if (!module) {
    return [];
  }
  
  return module.fields.map(field => ({
    value: field.fieldKey,
    label: field.label,
    description: `Tipo: ${field.fieldType}`
  }));
};

// Obtener todas las opciones de campos (sin filtrar por módulo)
export const getAllFieldOptions = (): ComboboxOption[] => {
  try {
    const modules = getModulesData();
    if (!modules || modules.length === 0) {
      return [];
    }
    const allFields: ComboboxOption[] = [];
    
    modules.forEach(module => {
      if (module.fields && Array.isArray(module.fields)) {
        module.fields.forEach(field => {
          allFields.push({
            value: field.fieldKey,
            label: field.label,
            description: `${module.name} - Tipo: ${field.fieldType}`
          });
        });
      }
    });
    
    return allFields;
  } catch (error) {
    return [];
  }
};

// Obtener información completa de un módulo por su key
export const getModuleByKey = (moduleKey: string): ModuleDefinition | undefined => {
  const modules = getModulesData();
  return modules.find(m => m.moduleKey === moduleKey);
};

// Obtener información completa de un campo por su key
export const getFieldByKey = (fieldKey: string): FieldDefinition | undefined => {
  const modules = getModulesData();
  for (const module of modules) {
    const field = module.fields.find(f => f.fieldKey === fieldKey);
    if (field) {
      return field;
    }
  }
  return undefined;
};

// Generar moduleKey desde el nombre del módulo
export const generateModuleKey = (moduleName: string): string => {
  return moduleName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
};

// Obtener el orden de los módulos según el JSON
export const getModuleOrder = (): Map<string, number> => {
  const modules = getModulesData();
  const orderMap = new Map<string, number>();
  
  modules.forEach((module, index) => {
    orderMap.set(module.moduleKey, index);
  });
  
  return orderMap;
};

// Obtener el orden de los campos dentro de un módulo según el JSON
export const getFieldOrderForModule = (moduleKey: string): Map<string, number> => {
  const module = getModuleByKey(moduleKey);
  const orderMap = new Map<string, number>();
  
  if (module && module.fields) {
    module.fields.forEach((field, index) => {
      orderMap.set(field.fieldKey, index);
    });
  }
  
  return orderMap;
};

