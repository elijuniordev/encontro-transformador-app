// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WhatsAppConfirmation from "./pages/WhatsAppConfirmation";
import InscriptionForm from "./pages/InscriptionForm";
import Login from "./pages/Login";
import Management from "./pages/Management";
import NotFound from "./pages/NotFound";
import RegistrationsClosedPage from "./pages/RegistrationsClosedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Container principal para garantir que o footer fique sempre no final */}
      <div className="flex flex-col min-h-screen"> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/whatsapp-confirmation" element={<WhatsAppConfirmation />} />
            <Route path="/inscription" element={<InscriptionForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/management" element={<Management />} />
            <Route path="/inscricoes-encerradas" element={<RegistrationsClosedPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div> {/* Fechamento do container principal */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;