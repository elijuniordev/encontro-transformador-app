// src/hooks/useManagementFilters.ts
import { useState, useMemo } from 'react';
import {
  DISCIPULADORES_OPTIONS as DISCIPULADORES_OPTIONS_FOR_FILTER,
  STATUS_PAGAMENTO_OPTIONS,
  IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS,
  SEXO_OPTIONS,
} from "@/config/options";
import { Inscription } from '@/types/supabase';

export const useManagementFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipulado, setFilterDiscipulado] = useState(false);
  const [filterByFuncao, setFilterByFuncao] = useState("all");
  const [filterByStatusPagamento, setFilterByStatusPagamento] = useState("all");
  const [filterByDiscipuladoGroup, setFilterByDiscipuladoGroup] = useState("all");
  const [filterBySexo, setFilterBySexo] = useState("all");

  const filterOptions = useMemo(() => ({
    funcaoOptions: FUNCAO_OPTIONS,
    statusPagamentoOptions: STATUS_PAGAMENTO_OPTIONS,
    discipuladoGroupOptions: DISCIPULADORES_OPTIONS_FOR_FILTER,
    sexoOptions: SEXO_OPTIONS,
  }), []);

  const filters = {
    searchTerm,
    filterDiscipulado,
    filterByFuncao,
    filterByStatusPagamento,
    filterByDiscipuladoGroup,
    filterBySexo,
  };

  const setFilters = {
    setSearchTerm,
    setFilterDiscipulado,
    setFilterByFuncao,
    setFilterByStatusPagamento,
    setFilterByDiscipuladoGroup,
    setFilterBySexo,
  };

  return {
    filters,
    setFilters,
    filterOptions,
  };
};