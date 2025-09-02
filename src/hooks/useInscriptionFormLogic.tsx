// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS } from "@/config/options";
import { formatPhoneNumber } from "@/lib/utils";

interface InscriptionFormData {
  [key: string]: string | undefined;
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

const whatsappSchema = z.string().trim().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato de WhatsApp inválido. Use (XX) XXXXX-XXXX.");

// <<< INÍCIO DA CORREÇÃO 1: AJUSTE NA VALIDAÇÃO >>>
const inscriptionSchema = z.object({
  situacao: z.string().nonempty("Por favor, selecione sua situação."),
  nomeCompleto: z.string().trim().min(3, "O nome completo é obrigatório."),
  sexo: z.string().nonempty("Por favor, selecione o sexo."),
  idade: z.string().nonempty("A idade é obrigatória.").refine((val) => {
    const idadeNum = parseInt(val, 10);
    return !isNaN(idadeNum) && idadeNum >= 12 && idadeNum <= 100;
  }, "Idade inválida (entre 12 e 100 anos)."),
  whatsapp: whatsappSchema.nonempty("O WhatsApp é obrigatório."),
  discipuladores: z.string().optional(),
  lider: z.string().optional(),
  anjoGuarda: z.string().optional(),
  nomeResponsavel1: z.string().trim().optional(),
  whatsappResponsavel1: whatsappSchema.optional().or(z.literal('')),
  nomeResponsavel2: z.string().trim().optional(),
  whatsappResponsavel2: whatsappSchema.optional().or(z.literal('')),
  nomeResponsavel3: z.string().trim().optional(),
  whatsappResponsavel3: whatsappSchema.optional().or(z.literal('')),
}).refine((data) => {
  // A validação de discipulador/líder agora só se aplica a 'Equipe' e 'Acompanhante'
  if (['Equipe', 'Acompanhante'].includes(data.situacao)) {
    return !!data.discipuladores && !!data.lider;
  }
  return true;
}, {
  message: "Discipulador e Líder são obrigatórios para Equipe e Acompanhantes.",
  path: ['discipuladores'],
}).refine((data) => {
  if (data.situacao === "Encontrista") {
    return !!data.nomeResponsavel1 && !!data.whatsappResponsavel1;
  }
  return true;
}, {
  message: "Para encontristas, o nome e WhatsApp do primeiro responsável são obrigatórios.",
  path: ['nomeResponsavel1'],
});
// <<< FIM DA CORREÇÃO 1 >>>

export const useInscriptionFormLogic = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InscriptionFormData>({
    discipuladores: "", lider: "", nomeCompleto: "", anjoGuarda: "", sexo: "",
    idade: "", whatsapp: "", situacao: "", nomeResponsavel1: "", whatsappResponsavel1: "",
    nomeResponsavel2: "", whatsappResponsavel2: "", nomeResponsavel3: "", whatsappResponsavel3: "",
  });
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const discipuladoresOptions = useMemo(() => DISCIPULADORES_OPTIONS.sort((a, b) => a.localeCompare(b, 'pt-BR')), []);
  const lideresMap = useMemo(() => LIDERES_MAP, []);
  const situacaoOptions = useMemo(() => IRMAO_VOCE_E_OPTIONS, []);

  const filteredLideresOptions = useMemo(() => {
    return formData.discipuladores ? lideresMap[formData.discipuladores] : [];
  }, [formData.discipuladores, lideresMap]);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase.from('event_settings').select('registrations_open').single();
      if (error) {
        console.error("Erro ao buscar status das inscrições:", error);
        setIsRegistrationsOpen(false);
      } else {
        setIsRegistrationsOpen(data.registrations_open);
      }
    };
    fetchRegistrationStatus();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    if (field.toLowerCase().includes('whatsapp')) {
      processedValue = formatPhoneNumber(value);
    }
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const resetForm = useCallback(() => {
    setFormData({
      discipuladores: "", lider: "", nomeCompleto: "", anjoGuarda: "", sexo: "",
      idade: "", whatsapp: "", situacao: "", nomeResponsavel1: "", whatsappResponsavel1: "",
      nomeResponsavel2: "", whatsappResponsual2: "", nomeResponsavel3: "", whatsappResponsavel3: "",
    });
    setIsSuccess(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isRegistrationsOpen) {
      toast({ title: "Inscrições Encerradas", description: "As inscrições para o Encontro com Deus estão encerradas.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    
    const processedData = { ...formData };

    processedData.nomeCompleto = processedData.nomeCompleto?.toUpperCase();
    processedData.anjoGuarda = processedData.anjoGuarda?.toUpperCase();
    processedData.nomeResponsavel1 = processedData.nomeResponsavel1?.toUpperCase();
    processedData.nomeResponsavel2 = processedData.nomeResponsavel2?.toUpperCase();
    processedData.nomeResponsavel3 = processedData.nomeResponsavel3?.toUpperCase();

    const parsedData = inscriptionSchema.safeParse(processedData);
    if (!parsedData.success) {
      toast({ title: "Erro de validação", description: parsedData.error.errors[0].message, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const isEncontrista = processedData.situacao === "Encontrista";
      
      const inscriptionData = {
        nome_completo: processedData.nomeCompleto,
        anjo_guarda: isEncontrista ? (processedData.anjoGuarda || processedData.nomeCompleto) : processedData.nomeCompleto,
        sexo: processedData.sexo,
        idade: processedData.idade,
        whatsapp: processedData.whatsapp,
        discipuladores: processedData.situacao === "Pastor, obreiro ou discipulador" ? processedData.nomeCompleto : (processedData.discipuladores || null),
        lider: processedData.situacao === "Pastor, obreiro ou discipulador" ? processedData.nomeCompleto : (processedData.lider || null),
        irmao_voce_e: processedData.situacao,
        responsavel_1_nome: processedData.nomeResponsavel1 || null,
        responsavel_1_whatsapp: processedData.whatsappResponsavel1 || null,
        responsavel_2_nome: processedData.nomeResponsual2 || null,
        responsavel_2_whatsapp: processedData.whatsappResponsavel2 || null,
        responsavel_3_nome: processedData.nomeResponsavel3 || null,
        responsavel_3_whatsapp: processedData.whatsappResponsavel3 || null,
        status_pagamento: processedData.situacao === "Cozinha" ? 'Isento' : 'Pendente',
        forma_pagamento: processedData.situacao === "Cozinha" ? 'Isento' : null,
        valor: 200.00
      };

      const { error } = await supabase.from('inscriptions').insert([inscriptionData]);

      if (error) throw new Error(error.message);

      toast({ title: "Inscrição realizada com sucesso!", description: "Sua inscrição foi registrada." });
      setIsSuccess(true);

    } catch (error: unknown) {
        toast({ title: "Erro na inscrição", description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isRegistrationsOpen, toast]);

  return {
    formData, setFormData, handleSubmit, isRegistrationsOpen, isLoading,
    isSuccess, resetForm, discipuladoresOptions, filteredLideresOptions,
    situacaoOptions, handleInputChange,
  };
};