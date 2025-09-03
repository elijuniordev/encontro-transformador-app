// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS } from "@/config/options";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "@/lib/utils";

export interface InscriptionFormData {
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
  nomeAcompanhante?: string;
  parentescoAcompanhante?: string;
}

const whatsappSchema = z.string().trim().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato de WhatsApp inválido. Use (XX) XXXXX-XXXX.");

const inscriptionSchema = z.object({
  situacao: z.string().nonempty("Por favor, selecione sua situação."),
  nomeCompleto: z.string().trim().min(3, "O nome completo é obrigatório."),
  sexo: z.string().nonempty("Por favor, selecione o sexo."),
  idade: z.string().nonempty("A idade é obrigatória."),
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
  nomeAcompanhante: z.string().optional(),
  parentescoAcompanhante: z.string().optional(),
}).superRefine((data, ctx) => {
  const idadeNum = parseInt(data.idade, 10);
  if (!isNaN(idadeNum)) {
    if (data.situacao !== 'Criança' && (idadeNum < 12 || idadeNum > 100)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Para adultos e equipes, a idade deve ser de 12 a 100 anos.", path: ['idade'] });
    }
    if (data.situacao === 'Criança' && idadeNum >= 12) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Para 'Criança', a idade deve ser menor que 12 anos. Para idades maiores, selecione 'Encontrista'.", path: ['idade'] });
    }
  }
  if (['Encontrista', 'Equipe', 'Acompanhante', 'Criança'].includes(data.situacao) && (!data.discipuladores || !data.lider)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Discipulador e Líder são obrigatórios. Para crianças, preencha com os dados dos pais/responsáveis.", path: ['discipuladores'] });
  }
  if ((data.situacao === "Encontrista" || data.situacao === "Criança") && (!data.nomeResponsavel1 || !data.whatsappResponsavel1)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "O nome e WhatsApp do primeiro responsável são obrigatórios.", path: ['nomeResponsavel1'] });
  }
  if (data.situacao === 'Criança' && (!data.nomeAcompanhante || !data.parentescoAcompanhante)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "O nome e o parentesco do acompanhante são obrigatórios para a inscrição da criança.", path: ['nomeAcompanhante'] });
  }
});

export const useInscriptionFormLogic = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InscriptionFormData>({
    discipuladores: "", lider: "", nomeCompleto: "", anjoGuarda: "", sexo: "",
    idade: "", whatsapp: "", situacao: "",
    nomeAcompanhante: "", parentescoAcompanhante: "",
  });
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const discipuladoresOptions = useMemo(() => DISCIPULADORES_OPTIONS.sort((a, b) => a.localeCompare(b, 'pt-BR')), []);
  const lideresMap = useMemo(() => LIDERES_MAP, []);
  const situacaoOptions = useMemo(() => IRMAO_VOCE_E_OPTIONS, []);
  const filteredLideresOptions = useMemo(() => formData.discipuladores ? lideresMap[formData.discipuladores] : [], [formData.discipuladores, lideresMap]);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase.from('event_settings').select('registrations_open').single();
      setIsRegistrationsOpen(error ? false : data.registrations_open);
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
      nomeResponsavel2: "", whatsappResponsavel2: "", nomeResponsavel3: "", whatsappResponsavel3: "",
      nomeAcompanhante: "", parentescoAcompanhante: "",
    });
    setIsSuccess(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isRegistrationsOpen) {
      toast({ title: "Inscrições Encerradas", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    
    const parsedData = inscriptionSchema.safeParse(formData);
    if (!parsedData.success) {
      toast({ title: "Erro de validação", description: parsedData.error.errors[0].message, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const isPastorObreiro = formData.situacao === "Pastor, obreiro ou discipulador";
      const isStaff = ["Cozinha"].includes(formData.situacao);
      const isChild = formData.situacao === 'Criança';
      const isEncontrista = formData.situacao === 'Encontrista';

      const calculateValue = () => {
        if (isChild) {
            const age = parseInt(formData.idade || '0', 10);
            if (age <= 2) return 0.00;
            if (age >= 3 && age <= 8) return 100.00;
        }
        return 200.00;
      };

      const finalValue = calculateValue();
      
      let anjoGuardaFinal = "";
      if (isChild) {
        anjoGuardaFinal = `${formData.nomeAcompanhante} (${formData.parentescoAcompanhante})`.toUpperCase();
      } else if (isEncontrista) {
        anjoGuardaFinal = (formData.anjoGuarda || "N/A").toUpperCase();
      } else {
        anjoGuardaFinal = formData.nomeCompleto.toUpperCase();
      }
      
      const inscriptionData = {
        nome_completo: formData.nomeCompleto.toUpperCase(),
        anjo_guarda: anjoGuardaFinal,
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: (isPastorObreiro || isStaff) ? formData.nomeCompleto.toUpperCase() : formData.discipuladores,
        lider: (isPastorObreiro || isStaff) ? formData.nomeCompleto.toUpperCase() : formData.lider,
        irmao_voce_e: formData.situacao,
        responsavel_1_nome: formData.nomeResponsavel1?.toUpperCase() || null,
        responsavel_1_whatsapp: formData.whatsappResponsavel1 || null,
        responsavel_2_nome: formData.nomeResponsavel2?.toUpperCase() || null,
        responsavel_2_whatsapp: formData.whatsappResponsavel2 || null,
        responsavel_3_nome: formData.nomeResponsavel3?.toUpperCase() || null,
        responsavel_3_whatsapp: formData.whatsappResponsavel3 || null,
        status_pagamento: isStaff || (isChild && finalValue === 0) ? 'Isento' : 'Pendente',
        forma_pagamento: null,
        valor: finalValue
      };

      const { error } = await supabase.from('inscriptions').insert([inscriptionData]).select();
      if (error) throw error;

      toast({ title: "Inscrição realizada com sucesso!", description: "Sua inscrição foi registrada." });
      setIsSuccess(true);

    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro inesperado.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Erro na inscrição", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isRegistrationsOpen, toast]);

  return {
    formData, setFormData, handleSubmit, isRegistrationsOpen, isLoading, isSuccess,
    discipuladoresOptions, filteredLideresOptions, situacaoOptions, handleInputChange, resetForm
  };
};