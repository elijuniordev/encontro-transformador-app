// src/pages/Management/useManagement.ts
import { useContext } from 'react';
import { ManagementContext, ManagementContextType } from './ManagementContext';

export const useManagement = () => {
  const context = useContext(ManagementContext);
  if (context === undefined) {
    throw new Error('useManagement must be used within a ManagementProvider');
  }
  return context as ManagementContextType;
};