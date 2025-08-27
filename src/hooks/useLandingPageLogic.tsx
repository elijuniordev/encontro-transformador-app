// src/hooks/useLandingPageLogic.tsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLandingPageLogic = () => {
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from('event_settings')
        .select('registrations_open')
        .single();

      if (error) {
        console.error("Erro ao buscar status das inscrições:", error);
        setIsRegistrationsOpen(false); // Assume fechado se houver erro
      } else {
        setIsRegistrationsOpen(data.registrations_open);
      }
    };
    fetchRegistrationStatus();
  }, []);

  return {
    isRegistrationsOpen,
  };
};