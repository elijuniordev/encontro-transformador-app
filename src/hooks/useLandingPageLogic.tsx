// src/hooks/useLandingPageLogic.tsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLandingPageLogic = () => {
  const { toast } = useToast();
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  // Link do grupo WhatsApp
  const whatsappGroupLink = "https://chat.whatsapp.com/KAh5AivWP9O9jUpeKd7q1O"; // SEU LINK DO GRUPO WHATSAPP AQUI

  const handleWhatsappButtonClick = useCallback(() => {
    // 1. Abre o link do WhatsApp em uma nova aba
    window.open(whatsappGroupLink, '_blank');
    
    // 2. Exibe o toast informativo
    toast({
      title: "Grupo do WhatsApp aberto!",
      description: "Volte a esta página para preencher o formulário de inscrição e garantir sua vaga.",
      duration: 8000, 
      variant: "default", 
    });
    // 3. O redirecionamento para o formulário será feito pelo <Link> no componente.
  }, [whatsappGroupLink, toast]);

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