// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS } from "@/config/options";
import { useNavigate } from "react-router-dom";

// Tipagem mais forte para o formulário
interface InscriptionFormData {
  discipuladores: string;
  lider: string;
  nomeCompleto: string;
  anjoGuarda: string;
  sexo: string;
  idade: string;
  whatsapp: string;
  situacao: string;
  nomeResponsavel1?: string;
  whatsappResponsavel1?: string;
  nomeResponsavel2?: string;
  whatsappResponsavel2?: string;
  nomeResponsavel3?: string;
  whatsappResponsavel3?: string;
}

// Crie um schema para o WhatsApp reutilizável para evitar repetição
const whatsappSchema = z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de WhatsApp inválido.");

// Validação com Zod
const inscriptionSchema = z.object({
  situacao: z.string().nonempty("Por favor, selecione sua situação."),
  nomeCompleto: z.string().min(3, "O nome completo é obrigatório."),
  sexo: z.string().nonempty("Por favor, selecione o sexo."),
  idade: z.string().nonempty("A idade é obrigatória.").refine((val) => {
    const idadeNum = parseInt(val, 10);
    return !isNaN(idadeNum) && idadeNum >= 12 && idadeNum <= 100;
  }, "Idade inválida (entre 12 e 100 anos)."),
  whatsapp: whatsappSchema.nonempty("O WhatsApp é obrigatório."),
  discipuladores: z.string().optional(),
  lider: z.string().optional(),
  anjoGuarda: z.string().optional(),
  nomeResponsavel1: z.string().optional(),
  whatsappResponsavel1: whatsappSchema.optional(),
  nomeResponsavel2: z.string().optional(),
  whatsappResponsavel2: whatsappSchema.optional(),
  nomeResponsavel3: z.string().optional(),
  whatsappResponsavel3: whatsappSchema.optional(),
}).refine((data) => {
  // Validação condicional para discipulador/líder
  if (data.situacao !== "Pastor, obreiro ou discipulador") {
    return !!data.discipuladores && !!data.lider;
  }
  return true;
}, {
  message: "Discipulador e Líder são obrigatórios para esta situação.",
  path: ['discipuladores'],
}).refine((data) => {
  // Validação condicional para o primeiro responsável
  if (data.situacao === "Encontrista") {
    return !!data.nomeResponsavel1 && !!data.whatsappResponsavel1;
  }
  return true;
}, {
  message: "Para encontristas, o nome e WhatsApp do primeiro responsável são obrigatórios.",
  path: ['nomeResponsavel1'],
});

export const useInscriptionFormLogic = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InscriptionFormData>({
    discipuladores: "",
    lider: "",
    nomeCompleto: "",
    anjoGuarda: "",
    sexo: "",
    idade: "",
    whatsapp: "",
    situacao: "",
  });
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Mover as listas para fora do hook ou importar do arquivo de config
  const discipuladoresOptions = DISCIPULADORES_OPTIONS.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const lideresMap = LIDERES_MAP;
  const situacaoOptions = IRMAO_VOCE_E_OPTIONS;

  const filteredLideresOptions = useMemo(() => {
    return formData.discipuladores ? lideresMap[formData.discipuladores] : [];
  }, [formData.discipuladores, lideresMap]);

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

  const resetForm = useCallback(() => {
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
  }, []);

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

    // Validação com Zod
    const parseResult = inscriptionSchema.safeParse(formData);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0];
      toast({
        title: "Erro de validação",
        description: firstError.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // VALIDAÇÃO DE WHATSAPP DUPLICADO
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
      // FIM DA VALIDAÇÃO DE WHATSAPP DUPLICADO

      const isPastorObreiro = formData.situacao === "Pastor, obreiro ou discipulador";
      const inscriptionData = {
        nome_completo: formData.nomeCompleto,
        anjo_guarda: isPastorObreiro ? formData.nomeCompleto : (formData.anjoGuarda || null),
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: isPastorObreiro ? formData.nomeCompleto : (formData.discipuladores || null),
        lider: isPastorObreiro ? formData.nomeCompleto : (formData.lider || null),
        irmao_voce_e: formData.situacao,
        responsavel_1_nome: formData.nomeResponsavel1 || null,
        responsavel_1_whatsapp: formData.whatsappResponsavel1 || null,
        responsavel_2_nome: formData.nomeResponsavel2 || null,
        responsavel_2_whatsapp: formData.whatsappResponsavel2 || null,
        responsavel_3_nome: formData.nomeResponsavel3 || null,
        responsavel_3_whatsapp: formData.whatsappResponsavel3 || null,
        status_pagamento: formData.situacao === "Cozinha" ? 'Isento' : 'Pendente',
        forma_pagamento: formData.situacao === "Cozinha" ? 'Isento' : null,
        valor: 200.00
      };

      const { error } = await supabase
        .from('inscriptions')
        .insert([inscriptionData])
        .select();

      if (error) {
        console.error('Erro ao inserir no Supabase:', error);
        throw error;
      }

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua inscrição foi registrada. Aguarde a confirmação do pagamento.",
      });

      resetForm();

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
  }, [formData, isRegistrationsOpen, toast, resetForm]);

  return {
    formData,
    setFormData,
    handleSubmit,
    isRegistrationsOpen,
    isLoading,
    discipuladoresOptions,
    filteredLideresOptions,
    situacaoOptions,
  };
};