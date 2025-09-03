// src/components/management/ManagementActions.tsx
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

interface ManagementActionsProps {
  filterDiscipulado: boolean;
  setFilterDiscipulado: (filter: boolean) => void;
  userRole: string | null;
  userDiscipulado: string | null;
  handleExportXLSX: () => void;
}

const ManagementActions = ({
  filterDiscipulado,
  setFilterDiscipulado,
  userRole,
  userDiscipulado,
  handleExportXLSX,
}: ManagementActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4 border-t pt-4">
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
  );
};

export default ManagementActions;