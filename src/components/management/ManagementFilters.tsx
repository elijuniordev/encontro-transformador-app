// src/components/management/ManagementFilters.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download } from "lucide-react";

interface ManagementFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterDiscipulado: boolean;
  setFilterDiscipulado: (filter: boolean) => void;
  userRole: string | null;
  userDiscipulado: string | null;
  handleExportXLSX: () => void;
}

const ManagementFilters = ({
  searchTerm,
  setSearchTerm,
  filterDiscipulado,
  setFilterDiscipulado,
  userRole,
  userDiscipulado,
  handleExportXLSX,
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