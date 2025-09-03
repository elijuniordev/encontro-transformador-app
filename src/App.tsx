// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
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
      <div className="flex flex-col min-h-screen"> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/inscription" element={<InscriptionForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/management" element={<Management />} />
            <Route path="/inscricoes-encerradas" element={<RegistrationsClosedPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;