"use client";
import Image from "next/image";
import LogoCompany from "../../../../../public/logov1.png";

interface CompanyPublicContentProps {
  description?: string;
  content?: string;
  logoUrl?: string;
  companyName?: string;
  onImageError?: () => void;
  imageError?: boolean;
}

export default function CompanyPublicContent({
  description,
  content,
  logoUrl,
  companyName,
  onImageError,
  imageError,
}: CompanyPublicContentProps) {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Layout de dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh]">
            {/* Columna Izquierda - Contenido */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1 flex flex-col justify-center">
              {/* Título Principal */}
              {companyName && (
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 leading-[1.1]">
                    <span className="block">{companyName}</span>
                  </h1>
                </div>
              )}

              {/* Descripción */}
              {description && (
                <div className="space-y-4 pt-2">
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                    {description}
                  </p>
                </div>
              )}

              {/* Contenido Principal */}
              {content && (
                <div className="space-y-4 pt-4">
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed text-base sm:text-lg max-w-2xl">
                    {content}
                  </div>
                </div>
              )}

              {/* Placeholder cuando no hay contenido */}
              {!content && !description && (
                <div className="pt-4">
                  <p className="text-gray-500 text-lg sm:text-xl">
                    Contenido disponible próximamente
                  </p>
                </div>
              )}
            </div>

            {/* Columna Derecha - Imagen */}
            <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-2xl">
                <div className="relative w-full aspect-square bg-gradient-to-br rounded-xl lg:rounded-[1.5rem] p-6 sm:p-8 lg:p-12 flex items-center justify-center  overflow-hidden ">
                  {/* Contenedor de la imagen */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {logoUrl && !imageError ? (
                      <img
                        src={logoUrl}
                        alt={companyName || "Logo de la empresa"}
                        className="w-full h-full max-w-[75%] max-h-[75%] object-contain drop-shadow-2xl filter brightness-110"
                        onError={onImageError}
                      />
                    ) : (
                      <div className="relative w-full h-full max-w-[75%] max-h-[75%]">
                        <Image
                          src={LogoCompany}
                          alt="Logo por defecto"
                          fill
                          className="object-contain drop-shadow-2xl filter brightness-110"
                          priority
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

