// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import InscriptionForm from "./pages/InscriptionForm";
import Login from "./pages/Login";
import ManagementLayout from "./pages/Management";
import DashboardPage from "./pages/Management/DashboardPage";
import InscriptionsPage from "./pages/Management/InscriptionsPage";
import DormitoryPage from "./pages/Management/DormitoryPage";
import NotFound from "./pages/NotFound";
import RegistrationsClosedPage from "./pages/RegistrationsClosedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <div className="flex flex-col min-h-screen"> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/inscription" element={<InscriptionForm />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rotas de Gerenciamento Aninhadas */}
            <Route path="/management" element={<ManagementLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="inscriptions" element={<InscriptionsPage />} />
                <Route path="dormitories" element={<DormitoryPage />} />
            </Route>

            <Route path="/inscricoes-encerradas" element={<RegistrationsClosedPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;