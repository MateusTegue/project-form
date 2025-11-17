import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AssignedTemplate } from '@/types/models';
import { FormAssignment } from '../../types/models';


export function useGetFormAssignedToCompany(companyId: string) {
  const [assignments, setAssignments] = useState<FormAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId || companyId === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchAssignedTemplates = async () => {
      try {
        const url = `/api/formassingment/${companyId}/assignedtocompany`;
        const res = await fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
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