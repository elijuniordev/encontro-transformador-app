import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS } from "@/config/options";
import { formatPhoneNumber } from "@/lib/utils"; // Importa a função da máscara

// Define a interface para o estado do formulário localmente para uso no hook
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

const whatsappSchema = z.string().trim().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato de WhatsApp inválido. Use (XX) XXXXX-XXXX.");

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
  if (data.situacao !== "Pastor, obreiro ou discipulador") {
    return !!data.discipuladores && !!data.lider;
  }
  return true;
}, {
  message: "Discipulador e Líder são obrigatórios para esta situação.",
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

export const useInscriptionFormLogic = () => {
  const { toast } = useToast();
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
  const [isSuccess, setIsSuccess] = useState(false);

  const discipuladoresOptions = useMemo(() => DISCIPULADORES_OPTIONS.sort((a, b) => a.localeCompare(b, 'pt-BR')), []);
  const lideresMap = useMemo(() => LIDERES_MAP, []);
  const situacaoOptions = useMemo(() => IRMAO_VOCE_E_OPTIONS, []);

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

  const handleChangeWithMask = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof InscriptionFormData) => {
    const { value } = e.target;
    const maskedValue = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, [fieldName]: maskedValue }));
  };

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
    setIsSuccess(false);
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
    
    const parsedData = inscriptionSchema.safeParse(formData);
    if (!parsedData.success) {
      const firstError = parsedData.error.errors[0];
      toast({
        title: "Erro de validação",
        description: firstError.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data: existingInscriptions, error: queryError } = await supabase
        .from('inscriptions')
        .select('whatsapp')
        .eq('whatsapp', formData.whatsapp);

      if (queryError) {
        throw new Error("Não foi possível verificar o WhatsApp. Tente novamente.");
      }

      if (existingInscriptions && existingInscriptions.length > 0) {
        throw new Error("Este número de WhatsApp já está cadastrado.");
      }

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
        .insert([inscriptionData]);

      if (error) {
        throw new Error(error.message || "Ocorreu um erro ao registrar sua inscrição.");
      }

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua inscrição foi registrada. Aguarde a confirmação do pagamento.",
      });

      setIsSuccess(true);

    } catch (error: unknown) {
        let errorMessage = "Ocorreu um erro inesperado.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast({
            title: "Erro na inscrição",
            description: errorMessage,
            variant: "destructive"
        });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isRegistrationsOpen, toast]);

  return {
    formData,
    setFormData,
    handleSubmit,
    isRegistrationsOpen,
    isLoading,
    isSuccess,
    resetForm,
    discipuladoresOptions,
    filteredLideresOptions,
    situacaoOptions,
    handleChangeWithMask,
  };
};