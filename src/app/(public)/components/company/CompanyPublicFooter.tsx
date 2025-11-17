"use client";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
} from "lucide-react";

interface CompanyPublicFooterProps {
  companyName: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export default function CompanyPublicFooter({
  companyName,
  address,
  city,
  country,
  email,
  phone,
  website,
  socialMedia,
}: CompanyPublicFooterProps) {
  const hasContactInfo = address || email || phone || website;
  const hasSocialMedia =
    socialMedia?.facebook ||
    socialMedia?.twitter ||
    socialMedia?.linkedin ||
    socialMedia?.instagram;

  if (!hasContactInfo && !hasSocialMedia) {
    return null;
  }

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Información de la Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {companyName}
              </h3>
              {address && (
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{address}</p>
                    {(city || country) && (
                      <p className="text-sm">
                        {city && country ? `${city}, ${country}` : city || country}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Información de Contacto */}
            {hasContactInfo && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contacto
                </h3>
                <div className="space-y-3">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                    >
                      <Mail className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      <span className="break-all">{email}</span>
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                    >
                      <Phone className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      <span>{phone}</span>
                    </a>
                  )}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors group"
                    >
                      <Globe className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      <span className="break-all">{website}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Redes Sociales */}
            {hasSocialMedia && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Síguenos
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialMedia?.facebook && (
                    <a
                      href={socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                      <span className="hidden sm:inline">Facebook</span>
                    </a>
                  )}
                  {socialMedia?.twitter && (
                    <a
                      href={socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-600 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                      <span className="hidden sm:inline">Twitter</span>
                    </a>
                  )}
                  {socialMedia?.linkedin && (
                    <a
                      href={socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>
                  )}
                  {socialMedia?.instagram && (
                    <a
                      href={socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                      <span className="hidden sm:inline">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} {companyName}. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

