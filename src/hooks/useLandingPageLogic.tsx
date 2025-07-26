// src/hooks/useLandingPageLogic.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLandingPageLogic = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  // Link do grupo WhatsApp
  const whatsappGroupLink = "https://chat.whatsapp.com/KAh5AivWP9O9jUpeKd7q1O"; // SEU LINK DO GRUPO WHATSAPP AQUI

  const handleWhatsappButtonClick = useCallback(() => {
    // 1. Abre o link do WhatsApp em uma nova aba/janela IMEDIATAMENTE (síncrono com o clique)
    window.open(whatsappGroupLink, '_blank');
    
    // 2. Exibir o toast IMEDIATAMENTE (também síncrono com o clique)
    toast({
      title: "Atenção Importante!",
      description: "O grupo do WhatsApp foi aberto em uma nova aba. Volte a esta página para continuar sua inscrição.",
      duration: 8000, // Toast visível por 8 segundos
      variant: "destructive", // Cores chamativas
    });

    // 3. Redirecionar a aba ATUAL IMEDIATAMENTE (NÃO há mais atraso)
    navigate('/whatsapp-confirmation'); 

  }, [navigate, whatsappGroupLink, toast]);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from('event_settings')
        .select('registrations_open')
        .single();

      if (error) {
        console.error("Erro ao buscar status das inscrições:", error);
        setIsRegistrationsOpen(false);
      } else {
        setIsRegistrationsOpen(data.registrations_open);
      }
    };
    fetchRegistrationStatus();
  }, []);

  return {
    isRegistrationsOpen,
    handleWhatsappButtonClick,
  };
};