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
      <CardContent className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Campo de Busca */}
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar por nome, WhatsApp ou discipuladores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Novos Filtros Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap">
          {/* Filtro por Função */}
          <Select value={filterByFuncao} onValueChange={setFilterByFuncao}>
            <SelectTrigger className="w-[180px] sm:w-[150px]">
              <SelectValue placeholder="Filtrar por Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem> {/* ALTERADO AQUI: value="all" */}
              {funcaoOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por Status de Pagamento */}
          <Select value={filterByStatusPagamento} onValueChange={setFilterByStatusPagamento}>
            <SelectTrigger className="w-[180px] sm:w-[180px]">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem> {/* ALTERADO AQUI: value="all" */}
              {statusPagamentoOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro por Discipulado */}
          <Select value={filterByDiscipuladoGroup} onValueChange={setFilterByDiscipuladoGroup}>
            <SelectTrigger className="w-[220px] sm:w-[180px]">
              <SelectValue placeholder="Filtrar por Discipulado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem> {/* ALTERADO AQUI: value="all" */}
              {discipuladoGroupOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


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

        {/* Botão de Exportar (visível apenas para admin) */}
        {userRole === "admin" && (
          <Button onClick={handleExportXLSX} className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center">
            <Download className="h-4 w-4" />
            Exportar XLSX
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ManagementFilters;