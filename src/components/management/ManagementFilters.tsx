// src/components/management/ManagementFilters.tsx

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download } from "lucide-react";

interface ManagementFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterDiscipulado: boolean;
  setFilterDiscipulado: (filter: boolean) => void;
  userRole: string | null;
  userDiscipulado: string | null;
  handleExportXLSX: () => void;
  
  filterByFuncao: string;
  setFilterByFuncao: (value: string) => void;
  filterByStatusPagamento: string;
  setFilterByStatusPagamento: (value: string) => void;
  filterByDiscipuladoGroup: string;
  setFilterByDiscipuladoGroup: (value: string) => void;
  funcaoOptions: string[];
  statusPagamentoOptions: string[];
  discipuladoGroupOptions: string[];
}

const ManagementFilters = ({
  searchTerm,
  setSearchTerm,
  filterDiscipulado,
  setFilterDiscipulado,
  userRole,
  userDiscipulado,
  handleExportXLSX,
  
  filterByFuncao,
  setFilterByFuncao,
  filterByStatusPagamento,
  setFilterByStatusPagamento,
  filterByDiscipuladoGroup,
  setFilterByDiscipuladoGroup,
  funcaoOptions,
  statusPagamentoOptions,
  discipuladoGroupOptions,
}: ManagementFiltersProps) => {
  return (
    <Card className="shadow-peaceful mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filtros e Ações
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Linha 1: Busca e Filtros Principais */}
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

        {/* Linha 2: Ações e Filtros Específicos */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Filtro por Discipulado (visível apenas para discipuladores) */}
          {userRole === "discipulador" && userDiscipulado && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Switch
                id="filter-discipulado"
                checked={filterDiscipulado}
                onCheckedChange={setFilterDiscipulado}
              />
              <Label htmlFor="filter-discipulado" className="text-sm cursor-pointer">
                Ver apenas meu discipulado ({userDiscipulado})
              </Label>
            </div>
          )}
          
          {/* Espaçador para alinhar o botão à direita */}
          <div className="flex-grow"></div>

          {/* Botão de Exportar (visível apenas para admin) */}
          {userRole === "admin" && (
            <Button onClick={handleExportXLSX} className="flex items-center gap-2 w-full md:w-auto justify-center">
              <Download className="h-4 w-4" />
              Exportar XLSX
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementFilters;