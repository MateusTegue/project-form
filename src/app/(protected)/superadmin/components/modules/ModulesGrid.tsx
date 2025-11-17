'use client';

import React from 'react';
import ModuleCard from './ModuleCard';
import type { Module } from './GetAllModulesCreated';

interface ModulesGridProps {
  modules: Module[];
}

export default function ModulesGrid({ modules }: ModulesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </div>
  );
}