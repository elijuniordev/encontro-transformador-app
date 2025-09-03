// src/pages/Management.tsx
import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom"; // Adicionado useLocation
import ManagementHeader from "@/components/management/ManagementHeader";
import Footer from "@/components/Footer";
import { ManagementProvider } from './Management/ManagementProvider';
import { useManagement } from './Management/useManagement';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Importado Tabs

const ManagementContent = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para obter a localização atual
  const { isAuthenticated, userEmail, userRole, handleLogout, isRegistrationsOpen, handleToggleRegistrations } = useManagement();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Determina o valor da aba ativa com base na rota atual
  const activeTab = location.pathname.split('/').pop() || 'dashboard';

  if (!isAuthenticated) {
    return <div>Redirecionando para o login...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-peaceful">
      <ManagementHeader
        userEmail={userEmail}
        userRole={userRole}
        handleLogout={handleLogout}
        isRegistrationsOpen={isRegistrationsOpen}
        handleToggleRegistrations={handleToggleRegistrations}
      />
      
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <Tabs value={activeTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard" asChild>
              <Link to="/management/dashboard">Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger value="inscriptions" asChild>
              <Link to="/management/inscriptions">Inscrições</Link>
            </TabsTrigger>
            <TabsTrigger value="dormitories" asChild>
              <Link to="/management/dormitories">Quartos</Link>
            </TabsTrigger>
            {/* Adicione outras abas aqui conforme novas páginas forem criadas */}
          </TabsList>
          
          {/* As TabsContent não precisam ser explicitamente renderizadas aqui,
              o Outlet se encarrega de renderizar o conteúdo da rota aninhada.
              As TabsTrigger apenas controlam a visualização da aba ativa. */}
          <Outlet />
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const ManagementLayout = () => (
  <ManagementProvider>
    <ManagementContent />
  </ManagementProvider>
);

export default ManagementLayout;