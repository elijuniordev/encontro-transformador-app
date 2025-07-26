// src/components/management/ManagementHeader.tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Importar CardContent também
import { Badge } from "@/components/ui/badge"; // Importar Badge
import { AlertTriangle, LogOut, Settings } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label"; // Importar Label se for usar o Switch novamente no futuro

interface ManagementHeaderProps {
  userEmail: string | null;
  userRole: string | null;
  isRegistrationsOpen: boolean;
  handleLogout: () => void;
  handleToggleRegistrations: () => void;
}

const ManagementHeader = ({
  userEmail,
  userRole,
  isRegistrationsOpen,
  handleLogout,
  handleToggleRegistrations,
}: ManagementHeaderProps) => {
  return (
    <Card className="shadow-peaceful mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-2">
          <div className="flex-grow min-w-0"> 
            <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="truncate">Sistema de Gestão - Encontro com Deus</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Logado como: <span className="truncate">{userEmail} ({userRole})</span>
            </p>
          </div>
          
          {/* Botões de Ação do Header - Ajustado para melhor responsividade no topo */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {userRole === "admin" && ( // A condição está correta como "admin"
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant={isRegistrationsOpen ? "destructive" : "default"} 
                    className="flex items-center gap-2 text-sm px-3 py-2 w-full justify-center"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {isRegistrationsOpen ? "Encerrar Inscrições" : "Abrir Inscrições"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isRegistrationsOpen ? "Tem certeza que deseja ENCERRAR as inscrições?" : "Tem certeza que deseja ABRIR as inscrições?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá {isRegistrationsOpen ? "encerrar" : "abrir"} imediatamente as inscrições para o Encontro com Deus. Os usuários verão o status atualizado.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleToggleRegistrations}>
                      {isRegistrationsOpen ? "Sim, Encerrar" : "Sim, Abrir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 text-sm px-3 py-2 w-full justify-center">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ManagementHeader;