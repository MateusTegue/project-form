import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface AssignedTemplate {
  assignmentId: string;  
  id: string;            
  name: string;
  description: string;
  templateType: string;
  status: string;
  created_at: string;
  publicToken: string;
  publicUrl: string;
  isActive: boolean;
  moduleAssignments: any[];
}

export function useGetAssignedTemplates(companyId: string) {
  const [assignments, setAssignments] = useState<AssignedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId || companyId === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchAssignedTemplates = async () => {
      try {
        const url = `/api/formassingment/${companyId}/assignments`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error('Error al obtener los formularios asignados');
        }

        const response = await res.json();
      
        const data = Array.isArray(response.data) 
          ? response.data.map((assignment: any) => ({
              assignmentId: assignment.id,  
              ...assignment.formTemplate,    
              publicToken: assignment.publicToken,
              publicUrl: assignment.publicUrl,
              isActive: assignment.isActive,
              created_at: assignment.created_at,
            }))
          : [];
        
        setAssignments(data);
      } catch (err: any) {
        setError(err.message);
        toast.error('Error al cargar formularios asignados');
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTemplates();
  }, [companyId]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    setAssignments([]);
  };

  return { assignments, loading, error, refetch };
}