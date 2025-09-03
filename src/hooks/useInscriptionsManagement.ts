// src/hooks/useInscriptionsManagement.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Inscription } from '@/types/supabase';
import { normalizeText } from '@/lib/utils';
import { useManagementFilters } from './useManagementFilters';

export const useInscriptionsManagement = (userDiscipulado: string | null) => {
  const { toast } = useToast();
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filters } = useManagementFilters();

  const fetchInscriptions = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('inscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as inscrições.",
        variant: "destructive"
      });
    } else {
      setInscriptions(data as Inscription[]);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchInscriptions();
  }, [fetchInscriptions]);

  const filteredInscriptions = useMemo(() => {
    return inscriptions.filter(inscription => {
      const normalizedSearchTerm = normalizeText(filters.searchTerm);
      const matchesSearch = normalizedSearchTerm === '' ? true : (
        normalizeText(inscription.nome_completo).includes(normalizedSearchTerm)
      );
      const matchesDiscipuladoByLoggedInUser = !filters.filterDiscipulado || (userDiscipulado && normalizeText(inscription.discipuladores) === normalizeText(userDiscipulado));
      const matchesFuncao = filters.filterByFuncao === "all" || inscription.irmao_voce_e === filters.filterByFuncao;
      const matchesStatusPagamento = filters.filterByStatusPagamento === "all" || inscription.status_pagamento === filters.filterByStatusPagamento;
      const matchesDiscipuladoGroup = filters.filterByDiscipuladoGroup === "all" || normalizeText(inscription.discipuladores) === normalizeText(filters.filterByDiscipuladoGroup);
      const matchesSexo = filters.filterBySexo === "all" || inscription.sexo === filters.filterBySexo.toLowerCase();

      return matchesSearch && matchesDiscipuladoByLoggedInUser && matchesFuncao && matchesStatusPagamento && matchesDiscipuladoGroup && matchesSexo;
    });
  }, [inscriptions, filters, userDiscipulado]);
  
  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from('inscriptions').delete().eq('id', id);

    if (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    } else {
      toast({ title: "Inscrição excluída com sucesso!" });
      fetchInscriptions();
    }
  }, [fetchInscriptions, toast]);

  return {
    inscriptions,
    filteredInscriptions,
    isLoadingInscriptions: isLoading,
    fetchInscriptions,
    handleDelete,
  };
};