// src/components/management/ManagementFilters.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"; // Certifique-se de que Label está importado
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
  
  // Novas props para os filtros adicionais
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
            id="search-term-input" // Adicionado ID para label
          />
          <Label htmlFor="search-term-input" className="sr-only">Buscar</Label> {/* Label oculto para acessibilidade */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Novos Filtros Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap">
          {/* Filtro por Função */}
          <div className="space-y-1"> {/* Adicionado div para agrupar Label e Select */}
            <Label htmlFor="filter-funcao" className="text-sm">Função</Label>
            <Select value={filterByFuncao} onValueChange={setFilterByFuncao}>
              <SelectTrigger id="filter-funcao" className="w-[180px] sm:w-[150px]">
                <SelectValue placeholder="Filtrar por Função" />
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
          <div className="space-y-1"> {/* Adicionado div para agrupar Label e Select */}
            <Label htmlFor="filter-status-pagamento" className="text-sm">Status Pagamento</Label>
            <Select value={filterByStatusPagamento} onValueChange={setFilterByStatusPagamento}>
              <SelectTrigger id="filter-status-pagamento" className="w-[180px] sm:w-[180px]">
                <SelectValue placeholder="Filtrar por Status" />
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
          <div className="space-y-1"> {/* Adicionado div para agrupar Label e Select */}
            <Label htmlFor="filter-discipulado-group" className="text-sm">Discipulado</Label>
            <Select value={filterByDiscipuladoGroup} onValueChange={setFilterByDiscipuladoGroup}>
              <SelectTrigger id="filter-discipulado-group" className="w-[220px] sm:w-[180px]">
                <SelectValue placeholder="Filtrar por Discipulado" />
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