// src/hooks/useInscriptionEditor.ts
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Inscription } from "@/types/supabase";

export const useInscriptionEditor = (onSaveSuccess: () => void) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inscription>>({});

  const handleEdit = useCallback((inscription: Inscription) => {
    setEditingId(inscription.id);
    setEditData({
      status_pagamento: inscription.status_pagamento,
      forma_pagamento: inscription.forma_pagamento,
      total_value: inscription.total_value,
      observacao: inscription.observacao,
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  const handleEditDataChange = (newData: Partial<Inscription>) => {
    if (newData.status_pagamento === 'Isento') {
      newData.total_value = 0;
      newData.forma_pagamento = null;
    }
    setEditData(newData);
  };

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from('inscriptions')
      .update(editData)
      .eq('id', editingId);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a inscrição.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Dados atualizados",
        description: "As informações foram salvas com sucesso.",
      });
      onSaveSuccess();
    }
    handleCancelEdit();
  }, [editingId, editData, onSaveSuccess, handleCancelEdit, toast]);

  return {
    editingId,
    setEditingId,
    editData,
    setEditData: handleEditDataChange,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
  };
};