// src/components/management/ManagementFilters.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ManagementFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterByFuncao: string;
  setFilterByFuncao: (value: string) => void;
  filterByStatusPagamento: string;
  setFilterByStatusPagamento: (value: string) => void;
  filterByDiscipuladoGroup: string;
  setFilterByDiscipuladoGroup: (value: string) => void;
  filterBySexo: string;
  setFilterBySexo: (value: string) => void;
  funcaoOptions: string[];
  statusPagamentoOptions: string[];
  discipuladoGroupOptions: string[];
  sexoOptions: string[];
}

const ManagementFilters = ({
  searchTerm,
  setSearchTerm,
  filterByFuncao,
  setFilterByFuncao,
  filterByStatusPagamento,
  setFilterByStatusPagamento,
  filterByDiscipuladoGroup,
  setFilterByDiscipuladoGroup,
  filterBySexo,
  setFilterBySexo,
  funcaoOptions,
  statusPagamentoOptions,
  discipuladoGroupOptions,
  sexoOptions,
}: ManagementFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 flex-wrap items-end">
      {/* Campo de Busca */}
      <div className="relative flex-grow w-full md:w-auto">
        <Label htmlFor="search-term-input" className="text-sm font-medium">Buscar</Label>
        <div className="relative mt-1">
          <Input
            type="text"
            placeholder="Nome, WhatsApp, discipulador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
            id="search-term-input"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Filtro por Sexo */}
      <div className="flex flex-col">
        <Label htmlFor="filter-sexo" className="text-sm font-medium mb-1">Sexo</Label>
        <Select value={filterBySexo} onValueChange={setFilterBySexo}>
          <SelectTrigger id="filter-sexo" className="w-full md:w-[130px]">
            <SelectValue placeholder="Sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {sexoOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Filtro por Função */}
      <div className="flex flex-col">
        <Label htmlFor="filter-funcao" className="text-sm font-medium mb-1">Função</Label>
        <Select value={filterByFuncao} onValueChange={setFilterByFuncao}>
          <SelectTrigger id="filter-funcao" className="w-full md:w-[150px]">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {funcaoOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Status de Pagamento */}
      <div className="flex flex-col">
        <Label htmlFor="filter-status-pagamento" className="text-sm font-medium mb-1">Status</Label>
        <Select value={filterByStatusPagamento} onValueChange={setFilterByStatusPagamento}>
          <SelectTrigger id="filter-status-pagamento" className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {statusPagamentoOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Discipulado */}
      <div className="flex flex-col">
        <Label htmlFor="filter-discipulado-group" className="text-sm font-medium mb-1">Discipulado</Label>
        <Select value={filterByDiscipuladoGroup} onValueChange={setFilterByDiscipuladoGroup}>
          <SelectTrigger id="filter-discipulado-group" className="w-full md:w-[180px]">
            <SelectValue placeholder="Discipulado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {discipuladoGroupOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ManagementFilters;