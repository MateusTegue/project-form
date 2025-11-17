import { Metadata } from 'next';
import CompanyPublicPage from '../../components/company/CompanyPublicPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: `Empresa - ${slug}`,
    description: 'Información de la empresa',
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;

  return <CompanyPublicPage slug={slug} />;
}

