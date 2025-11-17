import * as XLSX from 'xlsx';
import { Submission } from '../app/(protected)/company/types/models';
import { SubmissionWithModules } from '../app/(protected)/company/types/models';
import { getModuleOrder, getFieldOrderForModule } from '../utils/modulesAndFieldsData';

interface ExportOptions {
  submissions: Submission[];
  fileName?: string;
  fetchFullData?: boolean; // Si es true, obtiene los datos completos de cada submission
}

/**
 * Función auxiliar para obtener el valor de un answer por fieldKey
 * Similar a la función getAnswerValue en SagridocsItem
 */
const getAnswerValueByKey = (submission: Submission, fieldKey: string): string => {
  if (!submission.answers || submission.answers.length === 0) {
    return '-';
  }
  
  const answer = submission.answers.find(
    (a) => {
      const aKey = a.fieldKey?.toLowerCase() || a.field?.fieldKey?.toLowerCase() || '';
      return aKey === fieldKey.toLowerCase();
    }
  );
  
  if (!answer) {
    return '-';
  }
  
  if (answer.textValue) return answer.textValue;
  if (answer.numberValue !== undefined && answer.numberValue !== null) {
    return answer.numberValue.toString();
  }
  if (answer.dateValue) {
    try {
      const date = new Date(answer.dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("es-ES");
      }
    } catch (error) {
      // Ignorar error de fecha
    }
  }
  return '-';
};

/**
 * Obtener información del remitente desde submission o answers
 */
const getRemitterInfo = (submission: Submission) => {
  const name = submission.submitterName || 
               getAnswerValueByKey(submission, 'razon_social') || 
               getAnswerValueByKey(submission, 'nombre') || 
               getAnswerValueByKey(submission, 'name') || 
               "";

  const email = submission.submitterEmail || 
                getAnswerValueByKey(submission, 'email') || 
                getAnswerValueByKey(submission, 'correo') || 
                getAnswerValueByKey(submission, 'mail') || 
                "";

  const phone = submission.submitterPhone || 
                getAnswerValueByKey(submission, 'telefono') || 
                getAnswerValueByKey(submission, 'phone') || 
                getAnswerValueByKey(submission, 'teléfono') || 
                getAnswerValueByKey(submission, 'celular') || 
                "";

  const documentId = submission.submitterDocumentId || 
                     getAnswerValueByKey(submission, 'nitcedula') || 
                     getAnswerValueByKey(submission, 'nit') || 
                     getAnswerValueByKey(submission, 'cedula') || 
                     getAnswerValueByKey(submission, 'cédula') || 
                     getAnswerValueByKey(submission, 'documento') || 
                     getAnswerValueByKey(submission, 'documentId') || 
                     "";

  return { name, email, phone, documentId };
};

/**
 * Obtener el valor de display de un answer
 */
const getAnswerDisplayValue = (answer: Submission['answers'][number]): string => {
  if (answer.textValue) return answer.textValue;
  if (answer.numberValue !== undefined && answer.numberValue !== null) {
    return answer.numberValue.toString();
  }
  if (answer.dateValue) {
    return new Date(answer.dateValue).toLocaleDateString("es-ES");
  }
  return "-";
};

/**
 * Obtener datos completos de un submission con módulos ordenados
 */
const fetchFullSubmissionData = async (submissionId: string): Promise<SubmissionWithModules | null> => {
  try {
    const response = await fetch(`/api/submissions/${submissionId}/modules`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
};

/**
 * Obtener el valor de display de un answer con soporte para opciones
 */
const getAnswerDisplayValueEnhanced = (field: SubmissionWithModules['modules'][0]['fields'][0]): string => {
  const answer = field.answer;
  if (!answer) return "-";
  
  // Manejar archivos
  if (answer.fileUrl) {
    return answer.fileUrl;
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
        return selectedOptions.length > 0 ? selectedOptions.join(', ') : answer.jsonValue.join(', ');
      }
      return answer.jsonValue.join(', ');
    }
    return JSON.stringify(answer.jsonValue);
  }
  
  // Manejar valores de texto
  if (answer.textValue) {
    // Si el campo tiene opciones, buscar la opción correspondiente
    if (field.options && field.options.length > 0) {
      const option = field.options.find(opt => opt.value === answer.textValue);
      if (option) {
        return option.label;
      }
    }
    return answer.textValue;
  }
  
  // Manejar valores numéricos
  if (answer.numberValue !== undefined && answer.numberValue !== null) {
    return answer.numberValue.toString();
  }
  
  // Manejar fechas
  if (answer.dateValue) {
    try {
      const date = new Date(answer.dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
      }
    } catch (error) {
      // Si falla, devolver el valor original
    }
    return answer.dateValue.toString();
  }
  
  return "-";
};

/**
 * Exportar submissions a Excel
 */
export const exportSubmissionsToExcel = async ({ 
  submissions, 
  fileName = 'formularios',
  fetchFullData = false 
}: ExportOptions) => {
  if (!submissions || submissions.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Si fetchFullData es true, obtener los datos completos de cada submission
  let fullSubmissions: (Submission | SubmissionWithModules)[] = submissions;
  let fullSubmissionsData: (SubmissionWithModules | null)[] = [];
  
  if (fetchFullData) {
    // Obtener datos completos con módulos para el detalle
    fullSubmissionsData = await Promise.all(
      submissions.map(async (submission) => {
        return await fetchFullSubmissionData(submission.id);
      })
    );
    // Mantener submissions básicos para el resumen
    fullSubmissions = submissions;
  }

  // Crear workbook
  const workbook = XLSX.utils.book_new();

  // Hoja 1: Resumen de submissions
  const summaryData: any[] = [];

  fullSubmissions.forEach((submission, index) => {
    const remitterInfo = getRemitterInfo(submission);
    const statusLabels: Record<string, string> = {
      PENDIENTE: "Pendiente",
      PROCESANDO: "En proceso",
      PROCESADO: "Procesado",
    };

    const submittedDate = submission.submittedAt 
      ? (() => {
          try {
            const date = new Date(submission.submittedAt);
            if (isNaN(date.getTime())) {
              return submission.submittedAt;
            }
            return date.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch (error) {
            return submission.submittedAt;
          }
        })()
      : "-";

    // Obtener valores de la misma manera que la tabla
    const razonSocial = getAnswerValueByKey(submission, 'razon_social');
    const nitCedula = getAnswerValueByKey(submission, 'nitcedula');
    const tipoTercero = getAnswerValueByKey(submission, 'tipo_de_tercero') || 'Cliente';

    summaryData.push({
      'N°': index + 1,
      'ID': submission.id,
      'Fecha de Envío': submittedDate,
      'Razón Social': razonSocial,
      'NIT/Cédula': nitCedula,
      'Email': submission.submitterEmail || remitterInfo.email || '-',
      'Teléfono': remitterInfo.phone || '-',
      'Documento': remitterInfo.documentId || nitCedula || '-',
      'Tipo de Tercero': tipoTercero,
      'Estado': statusLabels[submission.status] || submission.status,
      'Formulario': submission.companyFormAssignment?.formTemplate?.name || "-",
      'Empresa': submission.companyFormAssignment?.company?.name || "-",
    });
  });

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

  // Hoja 2: Detalle completo con respuestas por módulo ordenadas según JSON
  const detailData: any[] = [];

  // Obtener orden de módulos desde JSON
  const moduleOrder = getModuleOrder();

  for (let index = 0; index < fullSubmissions.length; index++) {
    const submission = fullSubmissions[index];
    
    // Obtener datos completos con módulos (ya obtenidos si fetchFullData es true)
    const fullSubmissionData = fetchFullData 
      ? (fullSubmissionsData[index] || null)
      : await fetchFullSubmissionData(submission.id);
    
    if (!fullSubmissionData) {
      // Si no se pueden obtener los datos completos, usar los datos básicos
      const remitterInfo = getRemitterInfo(submission);
      
      detailData.push({
        'N°': index + 1,
        'ID Submission': submission.id,
        'Módulo': 'REMITENTE',
        'Campo': 'Nombre',
        'Valor': remitterInfo.name || submission.submitterName || '-',
      });

      detailData.push({
        'N°': '',
        'ID Submission': '',
        'Módulo': 'REMITENTE',
        'Campo': 'Email',
        'Valor': remitterInfo.email || submission.submitterEmail || '-',
      });

      detailData.push({
        'N°': '',
        'ID Submission': '',
        'Módulo': 'REMITENTE',
        'Campo': 'Teléfono',
        'Valor': remitterInfo.phone || submission.submitterPhone || '-',
      });

      detailData.push({
        'N°': '',
        'ID Submission': '',
        'Módulo': 'REMITENTE',
        'Campo': 'Documento',
        'Valor': remitterInfo.documentId || submission.submitterDocumentId || '-',
      });

      detailData.push({
        'N°': '',
        'ID Submission': '',
        'Módulo': 'REMITENTE',
        'Campo': 'Fecha de Envío',
        'Valor': submission.submittedAt 
          ? (() => {
              try {
                const date = new Date(submission.submittedAt);
                if (isNaN(date.getTime())) {
                  return submission.submittedAt;
                }
                return date.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } catch (error) {
                return submission.submittedAt;
              }
            })()
          : "-",
      });

      // Agregar una fila vacía entre submissions
      if (index < fullSubmissions.length - 1) {
        detailData.push({
          'N°': '',
          'ID Submission': '',
          'Módulo': '',
          'Campo': '',
          'Valor': '',
        });
      }
      continue;
    }

    // Agregar información del remitente
    detailData.push({
      'N°': index + 1,
      'ID Submission': fullSubmissionData.submissionInfo.id,
      'Módulo': 'REMITENTE',
      'Campo': 'Nombre',
      'Valor': fullSubmissionData.submissionInfo.submitterName || 'No proporcionado',
    });

    detailData.push({
      'N°': '',
      'ID Submission': '',
      'Módulo': 'REMITENTE',
      'Campo': 'Email',
      'Valor': fullSubmissionData.submissionInfo.submitterEmail || 'No proporcionado',
    });

    detailData.push({
      'N°': '',
      'ID Submission': '',
      'Módulo': 'REMITENTE',
      'Campo': 'Teléfono',
      'Valor': fullSubmissionData.submissionInfo.submitterPhone || 'No proporcionado',
    });

    detailData.push({
      'N°': '',
      'ID Submission': '',
      'Módulo': 'REMITENTE',
      'Campo': 'Documento',
      'Valor': fullSubmissionData.submissionInfo.submitterDocumentId || 'No proporcionado',
    });

    detailData.push({
      'N°': '',
      'ID Submission': '',
      'Módulo': 'REMITENTE',
      'Campo': 'Fecha de Envío',
      'Valor': fullSubmissionData.submissionInfo.submittedAt 
        ? (() => {
            try {
              const date = new Date(fullSubmissionData.submissionInfo.submittedAt);
              if (isNaN(date.getTime())) {
                return fullSubmissionData.submissionInfo.submittedAt;
              }
              return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            } catch (error) {
              return fullSubmissionData.submissionInfo.submittedAt;
            }
          })()
        : "-",
    });

    // Ordenar módulos según el orden del JSON
    const sortedModules = [...(fullSubmissionData.modules || [])].sort((a, b) => {
      const orderA = moduleOrder.get(a.moduleKey || '') ?? 999;
      const orderB = moduleOrder.get(b.moduleKey || '') ?? 999;
      return orderA - orderB;
    });

    // Agregar respuestas por módulo ordenadas
    sortedModules.forEach((module) => {
      // Ordenar campos dentro del módulo según el orden del JSON
      const fieldOrder = getFieldOrderForModule(module.moduleKey || '');
      const sortedFields = [...(module.fields || [])].sort((a, b) => {
        const orderA = fieldOrder.get(a.fieldKey || '') ?? 999;
        const orderB = fieldOrder.get(b.fieldKey || '') ?? 999;
        return orderA - orderB;
      });

      // Agregar cada campo del módulo
      sortedFields.forEach((field) => {
        detailData.push({
          'N°': '',
          'ID Submission': '',
          'Módulo': module.name,
          'Campo': field.label,
          'Valor': getAnswerDisplayValueEnhanced(field),
        });
      });
    });

    // Agregar una fila vacía entre submissions
    if (index < fullSubmissions.length - 1) {
      detailData.push({
        'N°': '',
        'ID Submission': '',
        'Módulo': '',
        'Campo': '',
        'Valor': '',
      });
    }
  }

  const detailSheet = XLSX.utils.json_to_sheet(detailData);
  XLSX.utils.book_append_sheet(workbook, detailSheet, 'Detalle Completo');

  // Generar nombre del archivo con fecha
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const finalFileName = `${fileName}_${dateStr}.xlsx`;

  // Descargar archivo
  XLSX.writeFile(workbook, finalFileName);
};

