"use client";

import React from 'react';
import BannerWelcome from './BannerWelcome';
import BannerStats from './BannerStats';
import BannerQuickActions from './BannerQuickActions';
import CompanyBannerSkeleton from './CompanyBannerSkeleton';
import { useCurrentUser } from '@/hooks/users/useCurrentUser';

// Flag de desarrollo - cambia a false cuando esté listo
const IS_UNDER_DEVELOPMENT = true;

export default function CompanyBanner() {
  const { user, loading: userLoading } = useCurrentUser();

  if (IS_UNDER_DEVELOPMENT) {
    return <CompanyBannerSkeleton />;
  }

  if (userLoading) {
    return <CompanyBannerSkeleton />;
  }

  return (
    <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BannerWelcome 
              companyName={user?.name || 'Empresa'}
              userName={user?.name || user?.name || 'Usuario'}
            />
          </div>

          <div className="flex items-center">
            <BannerQuickActions />
          </div>
        </div>

        <div className="mt-2">
          <BannerStats stats={{ total: 0, pending: 0, approved: 0, rejected: 0 }} />
        </div>
      </div>
    </div>
  );
}