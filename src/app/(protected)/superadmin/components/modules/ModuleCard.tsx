'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import ModuleCardHeader from './ModuleCardHeader';
import ModuleCardContent from './ModuleCardContent';
import type { Module } from './GetAllModulesCreated';

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/company/superadmin/modules/${module.id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 group cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      <ModuleCardHeader module={module} />
      <ModuleCardContent module={module} />
    </Card>
  );
}