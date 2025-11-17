"use client";
import { useState, useEffect } from "react";
import CompanyPublicHeader from "./CompanyPublicHeader";
import CompanyPublicContent from "./CompanyPublicContent";
import CompanyPublicFooter from "./CompanyPublicFooter";
import CompanyPublicLoading from "./CompanyPublicLoading";
import CompanyPublicError from "./CompanyPublicError";

interface CompanyPublicPageProps {
  slug: string;
}

interface Company {
  id: string;
  name: string;
  razonSocial: string;
  country: string;
  city: string;
  address: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountryCode?: string;
  companyInfo?: {
    title?: string;
    navigation?: Array<{ label: string; link: string }>;
    description?: string;
    content?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
      website?: string;
    };
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
}

export default function CompanyPublicPage({ slug }: CompanyPublicPageProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/company/slug/${slug}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 404) {
            throw new Error(errorData.error || "Empresa no encontrada. La empresa puede no tener un slug asignado.");
          }
          
          throw new Error(errorData.error || errorData.details || "Error al cargar la información de la empresa");
        }

        const data = await response.json();
        
        // Manejar diferentes formatos de respuesta
        let companyData = null;
        if (data.data) {
          companyData = data.data?.data || data.data;
        } else if (data.result) {
          companyData = data.result?.data || data.result;
        } else {
          companyData = data;
        }
        
        if (!companyData || !companyData.id) {
          throw new Error("Empresa no encontrada. La empresa puede no tener un slug asignado.");
        }

        setCompany(companyData);
      } catch (err: any) {
        setError(err.message || "Error al cargar la información de la empresa");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCompany();
    } else {
      setError("Slug no proporcionado");
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return <CompanyPublicLoading />;
  }

  if (error || !company) {
    return <CompanyPublicError error={error || "Empresa no encontrada"} />;
  }

  const companyInfo = company.companyInfo || {};
  const contactInfo = companyInfo.contactInfo || {};
  const socialMedia = companyInfo.socialMedia || {};
  const navigation = companyInfo.navigation || [];

  // Usar información de companyInfo si está disponible, sino usar información básica de la empresa
  // El nombre de la empresa siempre se usa en el header (no se usa title)
  const displayDescription = companyInfo.description || company.razonSocial;
  const displayEmail = contactInfo.email || company.contactEmail;
  const displayPhone = contactInfo.phone || (company.contactPhoneCountryCode && company.contactPhone 
    ? `${company.contactPhoneCountryCode} ${company.contactPhone}` 
    : company.contactPhone);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <CompanyPublicHeader
        companyName={company.name}
        logoUrl={company.logoUrl}
        onImageError={() => setImageError(true)}
        imageError={imageError}
        navigation={navigation}
      />
      
      <CompanyPublicContent
        description={companyInfo.description}
        content={companyInfo.content}
        logoUrl={company.logoUrl}
        companyName={company.name}
        onImageError={() => setImageError(true)}
        imageError={imageError}
      />
      
      <CompanyPublicFooter
        companyName={company.name}
        address={company.address}
        city={company.city}
        country={company.country}
        email={displayEmail}
        phone={displayPhone}
        website={contactInfo.website}
        socialMedia={socialMedia}
      />
    </div>
  );
}

