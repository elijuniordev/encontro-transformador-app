// src/pages/Management/ManagementProvider.tsx
import React, { useMemo, useEffect } from 'react';
import { useInscriptionsManagement } from '@/hooks/useInscriptionsManagement';
import { useEventSettings } from '@/hooks/useEventSettings';
import { useAuthManagement } from '@/hooks/useAuthManagement';
import { ManagementContext } from './ManagementContext';

export const ManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userEmail, userRole, userDiscipulado, isAuthenticated, handleLogout } = useAuthManagement();
  
  const { 
    inscriptions, 
    payments, 
    isLoading: isLoadingInscriptions, 
    fetchInscriptions, 
    handleDelete 
  } = useInscriptionsManagement(userRole, userDiscipulado);
  
  const { 
    isRegistrationsOpen, 
    isLoading: isLoadingSettings, 
    handleToggleRegistrations 
  } = useEventSettings();

  const isLoading = isLoadingInscriptions || isLoadingSettings;

  const value = useMemo(() => ({
    inscriptions,
    payments,
    isLoading,
    isRegistrationsOpen,
    userRole,
    userDiscipulado,
    isAuthenticated,
    userEmail,
    fetchInscriptions,
    handleDelete,
    handleLogout,
    handleToggleRegistrations,
  }), [inscriptions, payments, isLoading, isRegistrationsOpen, userRole, userDiscipulado, isAuthenticated, userEmail, fetchInscriptions, handleDelete, handleLogout, handleToggleRegistrations]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInscriptions();
    }
  }, [isAuthenticated, fetchInscriptions]);

  return (
    <ManagementContext.Provider value={value}>
      {children}
    </ManagementContext.Provider>
  );
};