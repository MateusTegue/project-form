'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import PublicFormHeader from './PublicFormHeader';
import PublicFormLoading from './PublicFormLoading';
import PublicFormError from './PublicFormError';
import PublicFormSuccess from './PublicFormSuccess';
import PublicFormAlreadySubmitted from './PublicFormAlreadySubmitted';
import PublicFormFields from './PublicFormFields';
import { PublicFormViewProps } from '../../types/models';


export default function PublicFormView({ token }: PublicFormViewProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignment, setAssignment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchFormAssignment();
  }, [token]);

  const fetchFormAssignment = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/public/form/${token}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Formulario no encontrado');
      }

      const result = await response.json();
      
      setAssignment(result.data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos del remitente
    if (!formData.submitter_name?.trim()) {
      toast.error('El nombre del remitente es requerido');
      return;
    }
    if (!formData.submitter_email?.trim()) {
      toast.error('El email del remitente es requerido');
      return;
    }
    if (!formData.submitter_phone?.trim()) {
      toast.error('El teléfono del remitente es requerido');
      return;
    }
    if (!formData.submitter_document?.trim()) {
      toast.error('El documento del remitente es requerido');
      return;
    }
    
    try {
      setSubmitting(true);

      // Separar los datos del remitente de las respuestas del formulario
      const { submitter_name, submitter_email, submitter_phone, submitter_document, ...answers } = formData;

      const response = await fetch(`/api/public/form/${token}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          submitterEmail: submitter_email,
          submitterName: submitter_name,
          submitterPhone: submitter_phone,
          submitterDocumentId: submitter_document,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors?.some((err: string) => 
          err.includes('already submitted') || 
          err.includes('Ya has enviado') ||
          err.includes('duplicate')
        )) {
          setAlreadySubmitted(true);
          toast.error('Este formulario ya fue enviado anteriormente');
          return;
        }
        
        throw new Error(result.error || result.errors?.[0] || 'Error al enviar el formulario');
      }

      setSubmitted(true);
      toast.success('¡Formulario enviado exitosamente!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
  };

  if (loading) {
    return <PublicFormLoading />;
  }

  if (error || !assignment) {
    return <PublicFormError error={error} onRetry={fetchFormAssignment} />;
  }

  if (alreadySubmitted) {
    return (
      <PublicFormAlreadySubmitted 
        companyName={assignment.company?.name}
        formName={assignment.formTemplate?.name}
        allowMultiple={assignment.allowMultipleSubmissions}
      />
    );
  }

  if (submitted) {
    return (
      <PublicFormSuccess 
        message={assignment.customConfig?.successMessage}
        companyName={assignment.company?.name}
        redirectUrl={assignment.company?.redirectUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <PublicFormHeader 
          formName={assignment.formTemplate?.name}
          companyName={assignment.company?.name}
          companyLogo={assignment.company?.logoUrl}
          companyLocation={`${assignment.company?.city}, ${assignment.company?.country}`}
          welcomeMessage={assignment.customConfig?.welcomeMessage}
        />

        <PublicFormFields
          assignment={assignment}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}