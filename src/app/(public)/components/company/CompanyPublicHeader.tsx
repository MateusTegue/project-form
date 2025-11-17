"use client";
import Image from "next/image";
import LogoCompany from "../../../../../public/logov1.png";
import CompanyPublicNavigation from "./CompanyPublicNavigation";

interface NavigationItem {
  label: string;
  href?: string;
  target?: '_self' | '_blank';
}

interface CompanyPublicHeaderProps {
  companyName: string;
  logoUrl?: string;
  onImageError: () => void;
  imageError: boolean;
  navigation?: NavigationItem[];
}

export default function CompanyPublicHeader({
  companyName,
  logoUrl,
  onImageError,
  imageError,
  navigation,
}: CompanyPublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between relative">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
              {logoUrl && !imageError ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-full w-full object-contain rounded-lg"
                  onError={onImageError}
                />
              ) : (
                <Image
                  src={LogoCompany}
                  alt="Logo por defecto"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain rounded-lg"
                  priority
                />
              )}
            </div>
            <div className="flex items-center min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-1 truncate">
                {companyName}
              </h1>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <CompanyPublicNavigation items={navigation} />
          </div>
        </div>
      </div>
    </header>
  );
}

