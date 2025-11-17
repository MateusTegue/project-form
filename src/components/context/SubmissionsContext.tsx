"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface SubmissionsContextType {
  submissions: any[];
  stats: SubmissionStats;
  loading: boolean;
  refreshSubmissions: () => Promise<void>;
}

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ 
  children, 
  companyId 
}: { 
  children: React.ReactNode;
  companyId: string;
}) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/v1/form-submissions/company/${companyId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
        setStats(data.stats);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [companyId]);

  return (
    <SubmissionsContext.Provider value={{
      submissions,
      stats,
      loading,
      refreshSubmissions: fetchSubmissions
    }}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);
  if (!context) {
    throw new Error('useSubmissions debe usarse dentro de SubmissionsProvider');
  }
  return context;
}