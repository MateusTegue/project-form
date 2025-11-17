import { Metadata } from 'next';
import PublicFormView from '../../components/publicForm/PublicFormView';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  
  return {
    title: 'Formulario',
    description: 'Complete el formulario asignado',
  };
}

export default async function PublicFormPage({ params }: PageProps) {
  const { token } = await params;

  return <PublicFormView token={token} />;
}