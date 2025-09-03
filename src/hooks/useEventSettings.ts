// src/hooks/useEventSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEventSettings = () => {
  const { toast } = useToast();
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrationStatus = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('event_settings')
      .select('registrations_open, id')
      .single();

    if (error) {
      console.error("Erro ao buscar status das inscrições:", error);
      setIsRegistrationsOpen(true); // Default to open on error
    } else {
      setIsRegistrationsOpen(data.registrations_open);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRegistrationStatus();
  }, [fetchRegistrationStatus]);

  const handleToggleRegistrations = useCallback(async () => {
    const newStatus = !isRegistrationsOpen;
    const settingsId = '8ff1cff8-2c26-4cc4-b2bf-7faa5612b747'; // ID fixo da configuração

    const { error } = await supabase
      .from('event_settings')
      .update({ registrations_open: newStatus })
      .eq('id', settingsId);

    if (error) {
      console.error("Erro ao atualizar status das inscrições:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível alterar o status das inscrições.",
        variant: "destructive"
      });
    } else {
      setIsRegistrationsOpen(newStatus);
      toast({
        title: "Status Atualizado",
        description: `Inscrições ${newStatus ? "abertas" : "encerradas"} com sucesso!`,
      });
    }
  }, [isRegistrationsOpen, toast]);

  return {
    isRegistrationsOpen,
    isLoadingSettings: isLoading,
    handleToggleRegistrations,
  };
};