import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Inscription } from '@/types/supabase';

export const useBatchPayment = (onSuccess: () => void) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função auxiliar para atualizar a coluna `forma_pagamento`
  const updateInscriptionPaymentMethods = useCallback(async (inscriptionId: string) => {
    const { data: currentPayments, error } = await supabase
      .from('payments')
      .select('payment_method')
      .eq('inscription_id', inscriptionId);

    if (error) {
      console.error("Erro ao buscar pagamentos para atualização:", error);
      return;
    }

    const uniqueMethods = [...new Set(currentPayments.map(p => p.payment_method))].filter(Boolean);
    const updatedPaymentMethods = uniqueMethods.join(', ');

    const { error: updateError } = await supabase
      .from('inscriptions')
      .update({ forma_pagamento: updatedPaymentMethods })
      .eq('id', inscriptionId);
    
    if (updateError) {
      console.error("Erro ao atualizar a inscrição com a nova forma de pagamento:", updateError);
      toast({ title: "Aviso", description: "O pagamento foi processado, mas a inscrição principal não foi atualizada.", variant: "default" });
    }
  }, [toast]);

  const handleSelectionChange = (inscriptionId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(inscriptionId)) {
        newSet.delete(inscriptionId);
      } else {
        newSet.add(inscriptionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (inscriptions: Inscription[]) => {
    const allIds = new Set(inscriptions.map(i => i.id));
    setSelectedIds(allIds);
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (!method || !amount || isNaN(parsedAmount) || parsedAmount <= 0 || selectedIds.size === 0) {
      toast({
        title: "Dados inválidos",
        description: "Preencha o valor, a forma de pagamento e selecione ao menos uma inscrição.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const paymentsToInsert = Array.from(selectedIds).map(id => ({
      inscription_id: id,
      amount: parsedAmount,
      payment_method: method,
    }));

    const { error } = await supabase.from('payments').insert(paymentsToInsert);

    if (error) {
      toast({
        title: "Erro ao registrar pagamentos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: `${selectedIds.size} pagamentos foram registrados com sucesso.`,
      });

      // Atualize as inscrições em lote após a inserção
      const updatePromises = Array.from(selectedIds).map(inscriptionId => 
        updateInscriptionPaymentMethods(inscriptionId)
      );
      await Promise.all(updatePromises);

      onSuccess(); // Atualiza a lista de inscrições
      setIsModalOpen(false); // Fecha o modal
    }
    setIsLoading(false);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedIds,
    amount,
    setAmount,
    method,
    setMethod,
    isLoading,
    handleSelectionChange,
    handleSelectAll,
    handleClearAll,
    handleSubmit,
  };
};