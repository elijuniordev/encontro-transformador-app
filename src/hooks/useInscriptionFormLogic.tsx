// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS, PARENTESCO_OPTIONS } from "@/config/options";
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
  // Discipulador e líder são obrigatórios para todos, exceto Pastor e Cozinha
  if (['Encontrista', 'Equipe', 'Acompanhante', 'Criança'].includes(data.situacao) && (!data.discipuladores || !data.lider)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Discipulador e Líder são obrigatórios. Para crianças, preencha com os dados dos pais/responsáveis.", path: ['discipuladores'] });
  }
  if ((data.situacao === "Encontrista" || data.situacao === "Criança") && (!data.nomeResponsavel1 || !data.whatsappResponsavel1)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "O nome e WhatsApp do primeiro responsável são obrigatórios.", path: ['nomeResponsavel1'] });
  }
});

export const useInscriptionFormLogic = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InscriptionFormData>({
    discipuladores: "", lider: "", nomeCompleto: "", anjoGuarda: "", sexo: "",
    idade: "", whatsapp: "", situacao: "",
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
      nomeResponsavel2: "", whatsappResponsavel2: "", nomeResponsavel3: "", whatsappResponsavel3: ""
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

    const processedData = { ...formData };
    
    const parsedData = inscriptionSchema.safeParse(processedData);
    if (!parsedData.success) {
      toast({ title: "Erro de validação", description: parsedData.error.errors[0].message, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const isPastorObreiro = processedData.situacao === "Pastor, obreiro ou discipulador";
      const isStaff = ["Cozinha"].includes(processedData.situacao);
      const isChild = processedData.situacao === 'Criança';
      const isEncontrista = processedData.situacao === 'Encontrista';

      const calculateValue = () => {
        if (isChild) {
            const age = parseInt(processedData.idade || '0', 10);
            if (age <= 2) return 0.00;
            if (age >= 3 && age <= 8) return 100.00;
        }
        return 200.00;
      };
      const finalValue = calculateValue();
      
      const inscriptionData = {
        nome_completo: processedData.nomeCompleto.toUpperCase(),
        anjo_guarda: (isPastorObreiro || isStaff || isChild) ? processedData.nomeCompleto.toUpperCase() : (processedData.anjoGuarda?.toUpperCase() || null),
        sexo: processedData.sexo,
        idade: processedData.idade,
        whatsapp: processedData.whatsapp,
        discipuladores: (isPastorObreiro || isStaff) ? processedData.nomeCompleto.toUpperCase() : processedData.discipuladores,
        lider: (isPastorObreiro || isStaff) ? processedData.nomeCompleto.toUpperCase() : processedData.lider,
        irmao_voce_e: processedData.situacao,
        responsavel_1_nome: processedData.nomeResponsavel1?.toUpperCase() || null,
        responsavel_1_whatsapp: processedData.whatsappResponsavel1 || null,
        responsavel_2_nome: processedData.nomeResponsavel2?.toUpperCase() || null,
        responsavel_2_whatsapp: processedData.whatsappResponsavel2 || null,
        responsavel_3_nome: processedData.nomeResponsavel3?.toUpperCase() || null,
        responsavel_3_whatsapp: processedData.whatsappResponsavel3 || null,
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
    discipuladoresOptions, filteredLideresOptions, situacaoOptions, handleInputChange, resetForm,
    parentescoOptions: PARENTESCO_OPTIONS,
  };
};