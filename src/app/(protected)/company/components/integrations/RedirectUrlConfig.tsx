"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/lib/auth";
import toast from "react-hot-toast";
import { Loader2, ExternalLink, Building2, Mail, Phone, Globe, Facebook, Twitter, Linkedin, Instagram, X, Navigation, FileText, Share2 } from "lucide-react";
import { Company } from "@/types/models";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function RedirectUrlConfig() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  
  // Información de la empresa
  const [companyInfo, setCompanyInfo] = useState({
    description: "",
    content: "",
    navigation: [] as Array<{ label: string; href?: string; target?: '_self' | '_blank' }>,
    contactInfo: {
      email: "",
      phone: "",
      website: "",
    },
    socialMedia: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user?.id) {
          toast.error("No se encontró información del usuario");
          return;
        }

        setCompanyId(user.id);

        const response = await fetch(`/api/company/${user.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener información de la empresa");
        }

        const data = await response.json();
        const companyData = data.data?.data || data.data;
        
        if (companyData) {
          setCompany(companyData);
          
          // Cargar companyInfo si existe
          if (companyData.companyInfo) {
            setCompanyInfo({
              description: companyData.companyInfo.description || "",
              content: companyData.companyInfo.content || "",
              navigation: companyData.companyInfo.navigation || [],
              contactInfo: {
                email: companyData.companyInfo.contactInfo?.email || "",
                phone: companyData.companyInfo.contactInfo?.phone || "",
                website: companyData.companyInfo.contactInfo?.website || "",
              },
              socialMedia: {
                facebook: companyData.companyInfo.socialMedia?.facebook || "",
                twitter: companyData.companyInfo.socialMedia?.twitter || "",
                linkedin: companyData.companyInfo.socialMedia?.linkedin || "",
                instagram: companyData.companyInfo.socialMedia?.instagram || "",
              },
            });
          }
        }
      } catch (error: any) {
        toast.error("Error al cargar la configuración");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const generateRedirectUrl = () => {
    if (!company) return "";
    const slug = company.companySlug || generateSlug(company.name);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/company/${slug}`;
  };

  const handleSave = async () => {
    if (!companyId || !company) {
      toast.error("No se encontró información de la empresa");
      return;
    }

    setSaving(true);
    try {
      // Generar URL automáticamente basada en el slug
      // Si no hay slug, se generará automáticamente en el backend
      const autoRedirectUrl = generateRedirectUrl();
      
      // Preparar companyInfo (solo incluir campos no vacíos)
      const infoToSave: any = {};
      if (companyInfo.description) infoToSave.description = companyInfo.description;
      if (companyInfo.content) infoToSave.content = companyInfo.content;
      
      // Incluir navegación si tiene items
      if (companyInfo.navigation && companyInfo.navigation.length > 0) {
        infoToSave.navigation = companyInfo.navigation.filter(item => item.label.trim() !== '');
      }
      
      const contactInfo: any = {};
      if (companyInfo.contactInfo.email) contactInfo.email = companyInfo.contactInfo.email;
      if (companyInfo.contactInfo.phone) contactInfo.phone = companyInfo.contactInfo.phone;
      if (companyInfo.contactInfo.website) contactInfo.website = companyInfo.contactInfo.website;
      if (Object.keys(contactInfo).length > 0) infoToSave.contactInfo = contactInfo;
      
      const socialMedia: any = {};
      if (companyInfo.socialMedia.facebook) socialMedia.facebook = companyInfo.socialMedia.facebook;
      if (companyInfo.socialMedia.twitter) socialMedia.twitter = companyInfo.socialMedia.twitter;
      if (companyInfo.socialMedia.linkedin) socialMedia.linkedin = companyInfo.socialMedia.linkedin;
      if (companyInfo.socialMedia.instagram) socialMedia.instagram = companyInfo.socialMedia.instagram;
      if (Object.keys(socialMedia).length > 0) infoToSave.socialMedia = socialMedia;

      // Actualizar la empresa - esto generará automáticamente el slug si no existe
      const response = await fetch(`/api/company/${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          redirectUrl: autoRedirectUrl,
          companyInfo: Object.keys(infoToSave).length > 0 ? infoToSave : null,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || responseData.message || responseData.details || "Error al guardar la configuración";
        throw new Error(errorMessage);
      }

      toast.success("Configuración guardada correctamente");
      
      // Actualizar el estado de la empresa
      const companyData = responseData.data?.data || responseData.data?.result?.data || responseData.data || responseData.result?.data;
      if (companyData) {
        setCompany(companyData);
        
        // Actualizar companyInfo en el estado
        if (companyData.companyInfo) {
          setCompanyInfo({
            description: companyData.companyInfo.description || "",
            content: companyData.companyInfo.content || "",
            navigation: companyData.companyInfo.navigation || [],
            contactInfo: {
              email: companyData.companyInfo.contactInfo?.email || "",
              phone: companyData.companyInfo.contactInfo?.phone || "",
              website: companyData.companyInfo.contactInfo?.website || "",
            },
            socialMedia: {
              facebook: companyData.companyInfo.socialMedia?.facebook || "",
              twitter: companyData.companyInfo.socialMedia?.twitter || "",
              linkedin: companyData.companyInfo.socialMedia?.linkedin || "",
              instagram: companyData.companyInfo.socialMedia?.instagram || "",
            },
          });
        }
        
        // Si se generó un nuevo slug, mostrar un mensaje
        if (companyData.companySlug && companyData.companySlug !== company.companySlug) {
          toast.success(`Slug generado automáticamente: ${companyData.companySlug}`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">No se encontró información de la empresa</p>
        </CardContent>
      </Card>
    );
  }

  const autoRedirectUrl = generateRedirectUrl();

  return (
    <div className="space-y-5">
      {/* URL Generada Automáticamente */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <div>
                <CardTitle className="text-sm font-semibold text-blue-900">URL de Redirección</CardTitle>
                <CardDescription className="text-xs mt-0.5 text-blue-700">
                  Esta URL se genera automáticamente basada en el nombre de tu empresa: <strong>{company.companySlug || generateSlug(company.name)}</strong>
                </CardDescription>
              </div>
            </div>
            {autoRedirectUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.open(autoRedirectUrl, '_blank');
                }}
                className="flex items-center gap-2 shrink-0 text-xs h-8 bg-white"
              >
                <ExternalLink className="w-3 h-3" />
                Ver Página
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Input
              value={autoRedirectUrl}
              readOnly
             
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(autoRedirectUrl);
                toast.success("URL copiada al portapapeles");
              }}
              className="shrink-0 bg-white"
            >
              Copiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Información Básica */}
        <Card className="border-l-4 border-l-primary border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <div>
                <CardTitle className="text-sm font-semibold">Información Básica</CardTitle>
                <CardDescription className="text-xs mt-0.5">Descripción y contenido principal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs">
                Descripción Corta <span className="text-gray-400">(Opcional)</span>
              </Label>
              <Input
                id="description"
                placeholder="Ej: Somos una empresa líder en tecnología e innovación..."
                value={companyInfo.description}
                onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                className="h-9 text-sm"
              />
              <p className="text-xs text-gray-500">
                Esta descripción aparecerá debajo del nombre de la empresa en el header de la página pública.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-xs">
                Contenido Principal <span className="text-gray-400">(Opcional)</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Escribe aquí el contenido principal de tu página. Puedes incluir información sobre tu empresa, servicios, valores, etc..."
                value={companyInfo.content}
                onChange={(e) => setCompanyInfo({ ...companyInfo, content: e.target.value })}
                rows={6}
                className="resize-none text-sm"
              />
              <p className="text-xs text-gray-500">
                Este contenido aparecerá en el área principal de la página pública. Puedes usar múltiples líneas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Menú de Navegación */}
        <Card className="border-l-4 border-l-primary border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              <div>
                <CardTitle className="text-sm font-semibold">Menú de Navegación</CardTitle>
                <CardDescription className="text-xs mt-0.5">Configura los elementos del menú del header</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-gray-600">
              Configura los elementos del menú de navegación que aparecerán en el header de tu página pública. Solo el nombre es requerido, la URL es opcional.
            </p>
            
            <div className="space-y-2">
              {companyInfo.navigation.map((item, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-lg bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1.5">
                      <Input
                        placeholder="Ej: Inicio, Servicios, Contacto..."
                        value={item.label}
                        onChange={(e) => {
                          const newNavigation = [...companyInfo.navigation];
                          newNavigation[index] = { ...newNavigation[index], label: e.target.value };
                          setCompanyInfo({ ...companyInfo, navigation: newNavigation });
                        }}
                        className="h-9 text-sm bg-white"
                      />
                      {item.href && (
                        <Input
                          type="text"
                          placeholder="URL o #seccion (opcional, ej: https://ejemplo.com o #contacto)"
                          value={item.href || ""}
                          onChange={(e) => {
                            const newNavigation = [...companyInfo.navigation];
                            newNavigation[index] = { ...newNavigation[index], href: e.target.value };
                            setCompanyInfo({ ...companyInfo, navigation: newNavigation });
                          }}
                          className="h-8 text-xs bg-white"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newNavigation = companyInfo.navigation.filter((_, i) => i !== index);
                        setCompanyInfo({ ...companyInfo, navigation: newNavigation });
                      }}
                      className="text-destructive hover:text-destructive h-8 w-8 shrink-0"
                      title="Eliminar"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCompanyInfo({
                    ...companyInfo,
                    navigation: [...companyInfo.navigation, { label: "", href: "", target: '_self' }]
                  });
                }}
                className="w-full h-9 text-sm"
              >
                + Agregar Elemento al Menú
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card className="border-l-4 border-l-primary border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <div>
                <CardTitle className="text-sm font-semibold">Información de Contacto</CardTitle>
                <CardDescription className="text-xs mt-0.5">Email, teléfono y sitio web</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-gray-600">
              Esta información aparecerá en el footer de la página pública. Si no completas estos campos, se usarán los datos básicos de la empresa.
            </p>
      
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail" className="text-xs">
                Email de Contacto <span className="text-gray-400">(Opcional)</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contacto@empresa.com"
                value={companyInfo.contactInfo.email}
                onChange={(e) => setCompanyInfo({
                  ...companyInfo,
                  contactInfo: { ...companyInfo.contactInfo, email: e.target.value }
                })}
                className="h-9 text-sm"
              />
              <p className="text-xs text-gray-500">
                Si no especificas un email, se usará el email de contacto de la empresa.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPhone" className="text-xs">
                Teléfono de Contacto <span className="text-gray-400">(Opcional)</span>
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+57 300 123 4567"
                value={companyInfo.contactInfo.phone}
                onChange={(e) => setCompanyInfo({
                  ...companyInfo,
                  contactInfo: { ...companyInfo.contactInfo, phone: e.target.value }
                })}
                className="h-9 text-sm"
              />
              <p className="text-xs text-gray-500">
                Si no especificas un teléfono, se usará el teléfono de contacto de la empresa.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactWebsite" className="text-xs">
                Sitio Web <span className="text-gray-400">(Opcional)</span>
              </Label>
              <Input
                id="contactWebsite"
                type="url"
                placeholder="https://www.empresa.com"
                value={companyInfo.contactInfo.website}
                onChange={(e) => setCompanyInfo({
                  ...companyInfo,
                  contactInfo: { ...companyInfo.contactInfo, website: e.target.value }
                })}
                className="h-9 text-sm"
              />
              <p className="text-xs text-gray-500">
                URL del sitio web de tu empresa. Debe comenzar con http:// o https://
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card className="border-l-4 border-l-primary border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" />
              <div>
                <CardTitle className="text-sm font-semibold">Redes Sociales</CardTitle>
                <CardDescription className="text-xs mt-0.5">Enlaces a tus perfiles sociales</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-gray-600">
              Agrega los enlaces de tus redes sociales. Aparecerán en el footer de la página pública.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="facebook" className="flex items-center gap-1.5 text-xs">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    Facebook <span className="text-gray-400">(Opcional)</span>
                  </Label>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="https://facebook.com/empresa"
                    value={companyInfo.socialMedia.facebook}
                    onChange={(e) => setCompanyInfo({
                      ...companyInfo,
                      socialMedia: { ...companyInfo.socialMedia, facebook: e.target.value }
                    })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="twitter" className="flex items-center gap-1.5 text-xs">
                    <Twitter className="w-3.5 h-3.5 text-blue-400" />
                    Twitter <span className="text-gray-400">(Opcional)</span>
                  </Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/empresa"
                    value={companyInfo.socialMedia.twitter}
                    onChange={(e) => setCompanyInfo({
                      ...companyInfo,
                      socialMedia: { ...companyInfo.socialMedia, twitter: e.target.value }
                    })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="linkedin" className="flex items-center gap-1.5 text-xs">
                    <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                    LinkedIn <span className="text-gray-400">(Opcional)</span>
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/company/empresa"
                    value={companyInfo.socialMedia.linkedin}
                    onChange={(e) => setCompanyInfo({
                      ...companyInfo,
                      socialMedia: { ...companyInfo.socialMedia, linkedin: e.target.value }
                    })}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="instagram" className="flex items-center gap-1.5 text-xs">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    Instagram <span className="text-gray-400">(Opcional)</span>
                  </Label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/empresa"
                    value={companyInfo.socialMedia.instagram}
                    onChange={(e) => setCompanyInfo({
                      ...companyInfo,
                      socialMedia: { ...companyInfo.socialMedia, instagram: e.target.value }
                    })}
                    className="h-9 text-sm"
                  />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón de guardar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full"
            size="default"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Guardar Configuración
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
