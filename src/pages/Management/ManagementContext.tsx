// src/pages/Management/ManagementContext.tsx
import { createContext } from 'react';
import { Inscription, Payment } from '@/types/supabase';

export interface ManagementContextType {
  inscriptions: Inscription[];
  payments: Payment[];
  isLoading: boolean;
  isRegistrationsOpen: boolean;
  userRole: string | null;
  userDiscipulado: string | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  fetchInscriptions: () => void;
  handleDelete: (id: string) => void;
  handleLogout: () => void;
  handleToggleRegistrations: () => void;
}

export const ManagementContext = createContext<ManagementContextType | undefined>(undefined);