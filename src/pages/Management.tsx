// src/pages/Management.tsx
import { useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import ManagementHeader from "@/components/management/ManagementHeader";
import Footer from "@/components/Footer";
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator, SidebarContent, SidebarHeader, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, BedDouble } from "lucide-react";
import { ManagementProvider } from './Management/ManagementProvider';
import { useManagement } from './Management/useManagement';

const ManagementContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, userRole, handleLogout, isRegistrationsOpen, handleToggleRegistrations } = useManagement();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div>Redirecionando para o login...</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gradient-peaceful">
        <Sidebar className="fixed inset-y-0 left-0">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <SidebarTrigger />
              <Link to="/management/dashboard" className="text-lg font-bold">Gestão</Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/management/dashboard">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/management/inscriptions">
                    <Users />
                    Inscrições
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/management/dormitories">
                    <BedDouble />
                    Quartos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarContent>
            {/* Adicione outras seções aqui, se necessário */}
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <ManagementHeader
            userEmail={userEmail}
            userRole={userRole}
            handleLogout={handleLogout}
            isRegistrationsOpen={isRegistrationsOpen}
            handleToggleRegistrations={handleToggleRegistrations}
          />
          <main className="flex-grow p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const ManagementLayout = () => (
  <ManagementProvider>
    <ManagementContent />
  </ManagementProvider>
);

export default ManagementLayout;