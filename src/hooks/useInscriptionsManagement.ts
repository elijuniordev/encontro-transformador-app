// src/hooks/useInscriptionsManagement.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Inscription, Payment } from '@/types/supabase';

export const useInscriptionsManagement = (userRole: string | null, userDiscipulado: string | null) => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: inscriptionsData, error: inscriptionsError } = await supabase
        .from('inscriptions')
        .select(`
          *,
          payments ( id, amount, payment_method, created_at )
        `)
        .order('created_at', { ascending: false }); // <--- ADIÇÃO AQUI

      if (inscriptionsError) throw inscriptionsError;

      const processedInscriptions = inscriptionsData.map(inscription => {
        // CORREÇÃO: Adicionando tipos explícitos para 'acc' e 'p'
        const paid_amount = inscription.payments.reduce((acc: number, p: Payment) => acc + p.amount, 0);
        return { ...inscription, paid_amount };
      });

      setInscriptions(processedInscriptions);

      const allPayments = inscriptionsData.flatMap(i => i.payments);
      setPayments(allPayments);

    } catch (error) {
      toast({
        title: "Erro ao buscar inscrições",
        description: "Não foi possível carregar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase.from('inscriptions').delete().eq('id', id);
    if (error) {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar a inscrição.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Inscrição deletada", description: "A inscrição foi removida com sucesso." });
      await fetchInscriptions();
    }
  }, [toast, fetchInscriptions]);

  useEffect(() => {
    if (userRole) { // Evita buscar dados antes de ter o perfil do usuário
        fetchInscriptions();
    }
  }, [fetchInscriptions, userRole]);

  return {
    inscriptions,
    payments,
    isLoading,
    fetchInscriptions,
    handleDelete
  };
};