'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth';
import { Mail, Phone, User } from 'lucide-react';

interface SuperAdminProfileSidebarProps {
  formData: any;
}

export default function SuperAdminProfileSidebar({ formData }: SuperAdminProfileSidebarProps) {
  const role = authService.getUserRole();
  
  const getAvatarFallback = () => {
    const firstName = formData.firstName?.charAt(0) || '';
    const lastName = formData.firstMiddleName?.charAt(0) || '';
    return `${firstName}${lastName}`.toUpperCase() || 'US';
  };

  const getDisplayName = () => {
    return `${formData.firstName || ''} ${formData.firstMiddleName || ''}`.trim() || 'Usuario';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage 
              src="https://github.com/shadcn.png" 
              alt="Avatar"
            />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">{getDisplayName()}</h2>
            <Badge variant="secondary" className="capitalize">
              {role.toLowerCase().replace('_', ' ')}
            </Badge>
            {formData.username && (
              <p className="text-sm text-muted-foreground">
                {formData.username}
              </p>
            )}
          </div>

          <div className="w-full space-y-3 pt-4">
            {formData.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{formData.email}</span>
              </div>
            )}
            
            {formData.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{formData.codePhone} {formData.phone}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}