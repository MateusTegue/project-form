"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Mail, Phone, FileText, User, Download, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmissionWithModules } from "../../../types/models";
import toast from "react-hot-toast";
import { getModuleOrder, getFieldOrderForModule } from "@/utils/modulesAndFieldsData";

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<SubmissionWithModules | null>(null);
  const [loading, setLoading] = useState(true);

  const submissionId = params?.id as string;

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/submissions/${submissionId}/modules`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error("Error al obtener el formulario");
      }

      const responseData = await response.json();
      
      // La estructura puede ser: { data: {...} } o directamente los datos
      const submissionData = responseData.data || responseData;
      
      // Validar que tenga la estructura correcta
      if (submissionData && submissionData.formInfo && submissionData.modules && submissionData.submissionInfo) {
        setSubmission(submissionData);
      } else {
        throw new Error("La estructura de datos recibida no es válida");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al cargar el formulario");
    } finally {
      setLoading(false);
    }
  };

  const getAnswerDisplayValue = (field: SubmissionWithModules['modules'][0]['fields'][0]) => {
    const answer = field.answer;
    if (!answer) return null;
    
    // Manejar archivos
    if (answer.fileUrl) {
      return {
        type: 'file',
        value: answer.fileUrl
      };
    }
    
    // Manejar valores JSON (checkboxes, selects múltiples)
    if (answer.jsonValue) {
      if (Array.isArray(answer.jsonValue)) {
        // Si es un array, buscar las opciones correspondientes
        if (field.options && field.options.length > 0) {
          const selectedOptions = answer.jsonValue
            .map((val: string) => {
              const option = field.options?.find(opt => opt.value === val);
              return option ? option.label : val;
            })
            .filter(Boolean);
          return {
            type: 'array',
            value: selectedOptions.length > 0 ? selectedOptions : answer.jsonValue
          };
        }
        return {
          type: 'array',
          value: answer.jsonValue
        };
      }
      return {
        type: 'object',
        value: answer.jsonValue
      };
    }
    
    // Manejar valores de texto
    if (answer.textValue) {
      // Si el campo tiene opciones, buscar la opción correspondiente
      if (field.options && field.options.length > 0) {
        const option = field.options.find(opt => opt.value === answer.textValue);
        if (option) {
          return {
            type: 'text',
            value: option.label
          };
        }
      }
      return {
        type: 'text',
        value: answer.textValue
      };
    }
    
    // Manejar valores numéricos
    if (answer.numberValue !== undefined && answer.numberValue !== null) {
      return {
        type: 'number',
        value: answer.numberValue.toString()
      };
    }
    
    // Manejar fechas
    if (answer.dateValue) {
      try {
        const date = new Date(answer.dateValue);
        if (!isNaN(date.getTime())) {
          return {
            type: 'date',
            value: date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })
          };
        }
      } catch (error) {
        // Si falla, devolver el valor original
      }
      return {
        type: 'date',
        value: answer.dateValue.toString()
      };
    }
    
    return null;
  };

  const renderAnswerValue = (field: SubmissionWithModules['modules'][0]['fields'][0]) => {
    const answerData = getAnswerDisplayValue(field);
    
    if (!answerData) {
      return (
        <div className="flex items-center gap-1.5 text-slate-400">
          <XCircle className="w-3 h-3 shrink-0" />
          <span className="text-sm italic">Sin respuesta</span>
        </div>
      );
    }
    
    switch (answerData.type) {
      case 'file':
        return (
          <div className="flex items-center gap-1.5">
            <Download className="w-3 h-3 text-primary shrink-0" />
            <a
              href={answerData.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline truncate font-medium"
            >
              {answerData.value.split('/').pop() || 'Ver archivo'}
            </a>
          </div>
        );
      
      case 'array':
        return (
          <div className="space-y-1">
            {Array.isArray(answerData.value) && answerData.value.length > 0 ? (
              answerData.value.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />
                  <span className="text-sm text-slate-900 font-medium truncate">{item}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-slate-400 italic">Sin valores seleccionados</span>
            )}
          </div>
        );
      
      case 'object':
        return (
          <pre className="text-[10px] bg-white p-2 rounded border border-slate-200 overflow-auto max-h-32">
            {JSON.stringify(answerData.value, null, 2)}
          </pre>
        );
      
      default:
        return (
          <p className="text-sm text-slate-900 font-medium whitespace-pre-wrap break-words">
            {answerData.value}
          </p>
        );
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDIENTE: "Pendiente",
      PROCESANDO: "En proceso",
      PROCESADO: "Procesado",
      EARRING: "Pendiente",
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      PENDIENTE: "outline",
      PROCESANDO: "secondary",
      PROCESADO: "default",
      EARRING: "outline",
    };
    return variants[status] || "outline";
  };

  // Ordenar módulos según el orden del JSON
  const sortedModules = useMemo(() => {
    if (!submission?.modules) return [];
    
    const moduleOrder = getModuleOrder();
    
    return [...submission.modules].sort((a, b) => {
      const orderA = moduleOrder.get(a.moduleKey || '') ?? 999;
      const orderB = moduleOrder.get(b.moduleKey || '') ?? 999;
      return orderA - orderB;
    }).map(module => {
      // Ordenar campos dentro de cada módulo según el orden del JSON
      const fieldOrder = getFieldOrderForModule(module.moduleKey || '');
      const sortedFields = [...module.fields].sort((a, b) => {
        const orderA = fieldOrder.get(a.fieldKey || '') ?? 999;
        const orderB = fieldOrder.get(b.fieldKey || '') ?? 999;
        return orderA - orderB;
      });
      
      return {
        ...module,
        fields: sortedFields
      };
    });
  }, [submission?.modules]);

  if (loading) {
    return (
      <div className="w-full px-6 py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!submission || !submission.formInfo) {
    return (
      <div className="w-full px-6 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-600">No se encontró el formulario o la información está incompleta</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[95%] mx-auto py-6 space-y-5">
        {/* Header Compacto */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-slate-200 px-5 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {submission.formInfo.templateName}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Detalle del formulario
              </p>
            </div>
          </div>
          <Badge 
            variant={getStatusVariant(submission.submissionInfo.status)}
            className="text-sm font-semibold px-3 py-1"
          >
            {getStatusLabel(submission.submissionInfo.status)}
          </Badge>
        </div>

        {/* Grid Principal: Remitente a la izquierda, Módulos a la derecha */}
        <div className="grid grid-cols-12 gap-5">
          {/* Columna Izquierda: Información del Remitente (30%) */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="shadow-sm border border-slate-200 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-600" />
                  Remitente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Nombre</p>
                  <p className="text-sm text-slate-900 font-medium">
                    {submission.submissionInfo.submitterName || (
                      <span className="text-slate-400 italic">No proporcionado</span>
                    )}
                  </p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    Email
                  </p>
                  {submission.submissionInfo.submitterEmail ? (
                    <a 
                      href={`mailto:${submission.submissionInfo.submitterEmail}`}
                      className="text-sm text-primary hover:underline font-medium block truncate"
                    >
                      {submission.submissionInfo.submitterEmail}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No proporcionado</p>
                  )}
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    Teléfono
                  </p>
                  <p className="text-sm text-slate-900 font-medium">
                    {submission.submissionInfo.submitterPhone || (
                      <span className="text-slate-400 italic">No proporcionado</span>
                    )}
                  </p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Documento</p>
                  <p className="text-sm text-slate-900 font-mono font-medium">
                    {submission.submissionInfo.submitterDocumentId || (
                      <span className="text-slate-400 italic">No proporcionado</span>
                    )}
                  </p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Fecha de envío
                  </p>
                  <p className="text-sm text-slate-900 font-medium">
                    {submission.submissionInfo.submittedAt 
                      ? (() => {
                          try {
                            const date = new Date(submission.submissionInfo.submittedAt);
                            if (isNaN(date.getTime())) {
                              return submission.submissionInfo.submittedAt;
                            }
                            return date.toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          } catch (error) {
                            return submission.submissionInfo.submittedAt;
                          }
                        })()
                      : (
                        <span className="text-slate-400 italic">No disponible</span>
                      )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Módulos (70%) */}
          <div className="col-span-12 lg:col-span-9 space-y-4">
            {sortedModules.map((module, moduleIndex) => (
              <Card 
                key={module.moduleKey || module.id} 
                className="shadow-sm border-l-4 border-l-primary border border-slate-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base font-semibold text-slate-900 truncate">
                          {module.name}
                        </CardTitle>
                        {module.isRequired && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-semibold">
                            Requerido
                          </Badge>
                        )}
                      </div>
                      {module.description && (
                        <CardDescription className="text-sm mt-1 line-clamp-2">
                          {module.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 shrink-0">
                      {module.fields.length} campo{module.fields.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {module.fields.length === 0 ? (
                      <div className="col-span-2 text-center py-6 text-slate-400 text-sm italic">
                        No hay campos en este módulo
                      </div>
                    ) : (
                      module.fields.map((field) => (
                        <div 
                          key={field.fieldKey || field.id} 
                          className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-700 mb-1 truncate" title={field.label}>
                                {field.label}
                              </p>
                              {field.isRequired && (
                                <span className="text-[10px] text-red-500 font-semibold">*</span>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize shrink-0">
                              {field.fieldType.toLowerCase()}
                            </Badge>
                          </div>
                          <div className="min-h-[24px]">
                            {renderAnswerValue(field)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

