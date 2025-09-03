// src/hooks/useBatchPayment.ts
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