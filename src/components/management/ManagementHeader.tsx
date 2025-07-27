// src/components/management/ManagementHeader.tsx
import { Link } from "react-router-dom";
import { LogOut, Settings, AlertTriangle } from "lucide-react"; // Adicionado Settings e AlertTriangle
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog"; // Importado AlertDialog components

interface ManagementHeaderProps {
  userEmail: string | null;
  userRole: string | null;
  handleLogout: () => void;
  isRegistrationsOpen: boolean; // Mantido e usado aqui
  handleToggleRegistrations: () => void; // Mantido e usado aqui
}

const ManagementHeader = ({
  userEmail,
  userRole,
  handleLogout,
  isRegistrationsOpen,
  handleToggleRegistrations,
}: ManagementHeaderProps) => {
  const getInitials = (email: string | null) => {
    if (!email) return "US";
    const parts = email.split('@')[0];
    return parts.slice(0, 2).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-md">
      <Link to="/management" className="flex items-center gap-2">
        <Settings className="h-6 w-6" /> {/* Alterado para Settings */}
        <h1 className="text-xl font-bold">Gestão</h1>
      </Link>
      <div className="flex items-center gap-4">
        {userEmail && (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
              <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:block">{userEmail}</span>
          </div>
        )}
        
        {/* Botão de Toggle de Inscrições para Admin (movido de volta para cá) */}
        {userRole === "admin" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant={isRegistrationsOpen ? "destructive" : "default"} 
                className="flex items-center gap-2 text-sm px-3 py-2 justify-center" // Ajustado para ser mais compacto
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

        <Button onClick={handleLogout} variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
          <LogOut className="h-5 w-5 mr-2" /> Sair
        </Button>
      </div>
    </header>
  );
};

export default ManagementHeader;