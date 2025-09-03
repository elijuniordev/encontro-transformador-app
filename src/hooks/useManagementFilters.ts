// src/hooks/useManagementFilters.ts
import { useState, useMemo } from 'react';
import {
  DISCIPULADORES_OPTIONS as DISCIPULADORES_OPTIONS_FOR_FILTER,
  STATUS_PAGAMENTO_OPTIONS,
  IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS,
  SEXO_OPTIONS,
} from "@/config/options";

// **INÍCIO DA CORREÇÃO**
// Define e exporta o tipo para o estado dos filtros
export type FiltersState = {
  searchTerm: string;
  filterDiscipulado: boolean;
  filterByFuncao: string;
  filterByStatusPagamento: string;
  filterByDiscipuladoGroup: string;
  filterBySexo: string;
};
// **FIM DA CORREÇÃO**

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

  const filters: FiltersState = { // Aplica o tipo aqui também
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