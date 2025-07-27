// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Definindo as opções e o mapeamento FORA do hook para que não sejam recriados a cada render
const DISCIPULADORES_OPTIONS = [
  "Arthur e Beatriz",
  "José Gomes e Edna",
  "Rosana",
  "Isaac e Andrea",
  "Rafael Ângelo e Ingrid",
  "Sou Obreiro, Discipulador ou Pastor"
];

const LIDERES_MAP = {
  "Arthur e Beatriz": ["Maria e Mauro", "Welligton e Nathalia", "Rafael Vicente e Fabiana", "Lucas e Gabriela Tangerino"],
  "José Gomes e Edna": ["Celina", "Junior e Patricia", "José Gomes e Edna", "Eliana", "Vinicius e Eliane"],
  "Rosana": ["Deusa", "Maria Sandrimara"],
  "Isaac e Andrea": ["Marcio e Rita", "Alexandre e Carol"],
  "Rafael Ângelo e Ingrid": ["Renan e Edziane", "Vladimir e Elaine", "Rafael Ângelo e Ingrid", "Hugo e Luciane"],
  "Sou Obreiro, Discipulador ou Pastor": ["Sou Obreiro, Discipulador ou Pastor"]
};

interface FormState {
  discipuladores: string;
  lider: string;
  nomeCompleto: string;
  anjoGuarda: string;
  sexo: string;
  idade: string;
  whatsapp: string;
  situacao: string;
  nomeResponsavel1: string;
  whatsappResponsavel1: string;
  nomeResponsavel2: string;
  whatsappResponsavel2: string;
  nomeResponsavel3: string;
  whatsappResponsavel3: string;
}

interface DiscipuladoresMap {
  [key: string]: string[];
}

export const useInscriptionFormLogic = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    discipuladores: "",
    lider: "",
    nomeCompleto: "",
    anjoGuarda: "",
    sexo: "",
    idade: "",
    whatsapp: "",
    situacao: "",
    nomeResponsavel1: "",
    whatsappResponsavel1: "",
    nomeResponsavel2: "",
    whatsappResponsavel2: "",
    nomeResponsavel3: "",
    whatsappResponsavel3: ""
  });
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const filteredDiscipuladoresOptions = useMemo(() => {
    if (formData.situacao === "Encontrista" || formData.situacao === "Cozinha") {
      return DISCIPULADORES_OPTIONS.filter(option => option !== "Sou Obreiro, Discipulador ou Pastor");
    }
    return DISCIPULADORES_OPTIONS;
  }, [formData.situacao]);

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

  const validateForm = useCallback(() => {
    if (!formData.discipuladores || !formData.nomeCompleto || !formData.sexo || !formData.idade || !formData.whatsapp || !formData.situacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos marcados com *.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.discipuladores !== "Sou Obreiro, Discipulador ou Pastor" && !formData.lider) {
      toast({
        title: "Campo 'Seu líder é' obrigatório",
        description: "Por favor, selecione seu líder.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.situacao === "Encontrista") {
      if (!formData.nomeResponsavel1 || !formData.whatsappResponsavel1) {
        toast({
          title: "Campos obrigatórios para Encontrista",
          description: "Para encontristas, o nome e WhatsApp do primeiro responsável são obrigatórios.",
          variant: "destructive"
        });
        return false;
      }
    }

    const idadeNum = parseInt(formData.idade);
    if (isNaN(idadeNum) || idadeNum < 12 || idadeNum > 100) {
        toast({
            title: "Idade inválida",
            description: "Por favor, insira uma idade válida (entre 12 e 100 anos).",
            variant: "destructive"
        });
        return false;
    }

    const whatsappRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (!whatsappRegex.test(formData.whatsapp)) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, insira um número de WhatsApp válido (ex: (DD) 9XXXX-XXXX).",
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [formData, toast]);


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isRegistrationsOpen) {
      toast({
        title: "Inscrições Encerradas",
        description: "As inscrições para o Encontro com Deus estão encerradas no momento.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // ** VALIDAÇÃO DE WHATSAPP DUPLICADO **
      const { data: existingInscriptions, error: queryError } = await supabase
        .from('inscriptions')
        .select('whatsapp')
        .eq('whatsapp', formData.whatsapp);

      if (queryError) {
        console.error("Erro ao verificar WhatsApp existente:", queryError);
        toast({
          title: "Erro na validação",
          description: "Não foi possível verificar o WhatsApp. Tente novamente.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (existingInscriptions && existingInscriptions.length > 0) {
        toast({
          title: "Inscrição duplicada",
          description: "Este número de WhatsApp já está cadastrado. Por favor, utilize outro ou entre em contato com a administração.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      // ** FIM DA VALIDAÇÃO DE WHATSAPP DUPLICADO **

      const finalLider = formData.discipuladores === "Sou Obreiro, Discipulador ou Pastor"
                         ? "Sou Obreiro, Discipulador ou Pastor"
                         : formData.lider;

      const finalAnjoGuarda = formData.anjoGuarda || (
          formData.situacao === "Equipe" ? "Equipe" :
          formData.situacao === "Cozinha" ? "Cozinha" : ''
      );

      // Definir status e forma de pagamento com base na situação
      let initialStatusPagamento = 'Pendente';
      let initialFormaPagamento = 'Pendente';

      if (formData.situacao === "Cozinha") {
        initialStatusPagamento = 'Isento';
        initialFormaPagamento = 'Isento';
      }

      const inscriptionData = {
        nome_completo: formData.nomeCompleto,
        anjo_guarda: finalAnjoGuarda,
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: formData.discipuladores,
        lider: finalLider,
        irmao_voce_e: formData.situacao,
        status_pagamento: initialStatusPagamento, // Usar o status definido condicionalmente
        forma_pagamento: initialFormaPagamento,   // Usar a forma de pagamento definida condicionalmente
        valor: 200.00
      };

      console.log("Dados da inscrição:", inscriptionData);

      const { data, error } = await supabase
        .from('inscriptions')
        .insert([inscriptionData])
        .select();

      if (error) {
        console.error('Erro ao inserir no Supabase:', error);
        throw error;
      }

      console.log('Inscrição salva com sucesso:', data);

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua inscrição foi registrada. Aguarde a confirmação do pagamento.",
      });

      setFormData({
        discipuladores: "",
        lider: "",
        nomeCompleto: "",
        anjoGuarda: "",
        sexo: "",
        idade: "",
        whatsapp: "",
        situacao: "",
        nomeResponsavel1: "",
        whatsappResponsavel1: "",
        nomeResponsavel2: "",
        whatsappResponsavel2: "",
        nomeResponsavel3: "",
        whatsappResponsavel3: ""
      });

    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro na inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isRegistrationsOpen, validateForm, toast]);

  return {
    formData,
    setFormData,
    handleSubmit,
    isRegistrationsOpen,
    isLoading,
    discipuladoresOptions: DISCIPULADORES_OPTIONS,
    lideresMap: LIDERES_MAP,
    filteredDiscipuladoresOptions,
  };
};