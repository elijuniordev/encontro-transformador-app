// src/components/management/ManagementHeader.tsx
import { Link } from "react-router-dom";
import { LogOut, Settings, AlertTriangle } from "lucide-react";
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
} from "@/components/ui/alert-dialog";

interface ManagementHeaderProps {
  userEmail: string | null;
  userRole: string | null;
  handleLogout: () => void;
  isRegistrationsOpen: boolean;
  handleToggleRegistrations: () => void;
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
    <header className="flex flex-col sm:flex-row items-center sm:justify-between p-4 bg-primary text-primary-foreground shadow-md">
      {/* Container da Esquerda: Título e Avatar/Email no Mobile */}
      <div className="flex items-center justify-between w-full sm:w-auto mb-2 sm:mb-0">
        <Link to="/management" className="flex items-center gap-2 flex-shrink-0">
          <Settings className="h-6 w-6" />
          <h1 className="text-xl font-bold">Gestão</h1>
        </Link>
        {/* Avatar/Email visível apenas no mobile (até sm) neste bloco */}
        {userEmail && (
          <div className="flex items-center gap-2 sm:hidden">
            <Avatar>
              <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
              <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
            </Avatar>
            {/* Email oculto no mobile pequeno para economizar espaço */}
            <span className="text-sm hidden xs:block">{userEmail}</span> 
          </div>
        )}
      </div>

      {/* Container da Direita: Avatar/Email no Desktop e Botões de Ação */}
      <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
        {/* Avatar/Email visível apenas no desktop (a partir de sm) neste bloco */}
        {userEmail && (
          <div className="hidden sm:flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
              <AvatarFallback>{getInitials(userEmail)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{userEmail}</span>
          </div>
        )}

        {/* Botão de Toggle de Inscrições para Admin */}
        {userRole === "admin" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={isRegistrationsOpen ? "destructive" : "default"}
                className="flex items-center gap-1 text-xs px-2 py-1 justify-center sm:px-3 sm:py-2 sm:text-sm" // Tamanho ajustado para mobile
              >
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" /> {/* Ícone menor no mobile */}
                {isRegistrationsOpen ? "Encerrar" : "Abrir"}
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

        <Button onClick={handleLogout} variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20 flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-2 sm:text-sm"> {/* Tamanho ajustado para mobile */}
          <LogOut className="h-3 w-3 sm:h-5 sm:w-5" /> Sair
        </Button>
      </div>
    </header>
  );
};

export default ManagementHeader;