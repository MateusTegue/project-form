'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ContenDinamicOptions from '@/app/(protected)/superadmin/components/contenDinamicOptions/ContenDinamicOptions';

interface CompanyAssignmentTabsProps {
  companyId: string;
  companyName: string;
}

export default function CompanyAssignmentTabs({ companyId, companyName }: CompanyAssignmentTabsProps) {
  return (
    <Card className="p-0 overflow-hidden">
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="w-full grid grid-cols-2 rounded-none h-12">
          <TabsTrigger value="assigned" className="data-[state=active]:bg-slate-200">
            Formularios Asignados
          </TabsTrigger>
          <TabsTrigger value="assign" className="data-[state=active]:bg-slate-200">
            Asignar Formularios
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="assigned" className="mt-0">
            <ContenDinamicOptions 
              optionSelected="assigned" 
              companyId={companyId} 
              companyName={companyName} 
            />
          </TabsContent>

          <TabsContent value="assign" className="mt-0">
            <ContenDinamicOptions 
              optionSelected="assign" 
              companyId={companyId} 
              companyName={companyName} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}