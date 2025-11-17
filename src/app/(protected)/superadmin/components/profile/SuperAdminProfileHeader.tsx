'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Settings } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function SuperAdminProfileHeader() {
  const user = authService.getCurrentUser();
  const role = authService.getUserRole();

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl">Mi Perfil</CardTitle>
            <CardDescription>
              Gestiona tu información personal y configuración de cuenta
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{user?.firstName} {user?.firstMiddleName}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {role.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}