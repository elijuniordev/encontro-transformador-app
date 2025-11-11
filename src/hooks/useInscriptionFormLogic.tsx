// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS, PARENTESCO_OPTIONS } from "@/config/options";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "@/lib/utils";
import { eventDetails } from "@/config/eventDetails";
import { InscriptionFormData } from "@/types/forms";
import { inscriptionSchema } from "@/lib/validations/inscriptionSchema";
import { ZodError } from "zod";

type ValidationErrors = {
  [key: string]: string | undefined;
};

export const useInscriptionFormLogic = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<InscriptionFormData>({
    discipuladores: "", lider: "", nomeCompleto: "", anjoGuarda: "", sexo: "",
    idade: "", whatsapp: "", situacao: "",
    nomeResponsavel1: "", whatsappResponsavel1: "",
    nomeResponsavel2: "", whatsappResponsavel2: "",
    nomeResponsavel3: "", whatsappResponsavel3: "",
    nomeAcompanhante: "", parentescoAcompanhante: "",
  });
  
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const discipuladoresOptions = useMemo(() => DISCIPULADORES_OPTIONS.sort((a, b) => a.localeCompare(b, 'pt-BR')), []);
  const lideresMap = useMemo(() => LIDERES_MAP, []);
  const situacaoOptions = useMemo(() => IRMAO_VOCE_E_OPTIONS, []);
  const parentescoOptions = useMemo(() => PARENTESCO_OPTIONS, []);
  const filteredLideresOptions = useMemo(() => formData.discipuladores ? lideresMap[formData.discipuladores as keyof typeof lideresMap] : [], [formData.discipuladores, lideresMap]);

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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

  const validateForm = useCallback(() => {
    try {
      inscriptionSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
        toast({ title: "Existem erros no formulário", description: "Por favor, corrija os campos destacados.", variant: "destructive" });
      }
      return false;
    }
  }, [formData, toast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isRegistrationsOpen) {
      toast({ title: "Inscrições Encerradas", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const isPastorObreiro = formData.situacao === "Pastor, obreiro ou discipulador";
      const isExemptStaff = formData.situacao === "Cozinha";
      const isChild = formData.situacao === 'Criança';
      const isEncontrista = formData.situacao === 'Encontrista';

      let finalValue = eventDetails.fullValue;
      let paymentStatus = 'Pendente';

      if (isChild) {
        const age = parseInt(formData.idade || '0', 10);
        if (age <= eventDetails.childFreeCutoffAge) {
          finalValue = 0.00;
          paymentStatus = 'Isento';
        } else if (age <= eventDetails.childValueCutoffAge) {
          finalValue = eventDetails.childValue;
        }
      }

      if (isExemptStaff || isPastorObreiro) { 
        finalValue = 0.00;
        paymentStatus = 'Isento';
      }
      
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
        // --- INÍCIO DA CORREÇÃO ---
        // Capitaliza a primeira letra para bater com o CHECK ('Feminino', 'Masculino')
        sexo: formData.sexo.charAt(0).toUpperCase() + formData.sexo.slice(1),
        // --- FIM DA CORREÇÃO ---
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: (isPastorObreiro || isExemptStaff) ? formData.nomeCompleto.toUpperCase() : formData.discipuladores,
        lider: (isPastorObreiro || isExemptStaff) ? formData.nomeCompleto.toUpperCase() : formData.lider,
        irmao_voce_e: formData.situacao,
        responsavel_1_nome: formData.nomeResponsavel1?.toUpperCase() || null,
        responsavel_1_whatsapp: formData.whatsappResponsavel1 || null,
        responsavel_2_nome: formData.nomeResponsavel2?.toUpperCase() || null,
        responsavel_2_whatsapp: formData.whatsappResponsavel2 || null,
        responsavel_3_nome: formData.nomeResponsavel3?.toUpperCase() || null,
        responsavel_3_whatsapp: formData.whatsappResponsavel3 || null,
        status_pagamento: paymentStatus,
        forma_pagamento: null,
        total_value: finalValue,
        paid_amount: 0,
        acompanhante_nome: isChild ? formData.nomeAcompanhante?.toUpperCase() : null,
        acompanhante_parentesco: isChild ? formData.parentescoAcompanhante : null,
      };

      // O bloco de DEBUG foi removido daqui.

      const { error, status } = await supabase.from('inscriptions').insert([inscriptionData]).select();
      
      if (error) {
        console.error("ERRO CRÍTICO NA INSERÇÃO (Supabase Error Object):", error);
        console.error("STATUS HTTP:", status);
        throw error;
      }

      toast({ title: "Inscrição realizada com sucesso!", description: "Sua inscrição foi registrada." });
      setIsSuccess(true);

    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro inesperado. Verifique o Console (F12) para detalhes do erro.";
      
      if (error instanceof Error) {
        errorMessage = `Erro de rede/cliente: ${error.message}`;
        console.error("ERRO DE EXECUÇÃO (Network/Client Error):", error);
      } else {
         console.error("ERRO DESCONHECIDO:", error);
      }
      
      toast({ title: "Erro na inscrição", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isRegistrationsOpen, toast, validateForm]);

  return {
    formData, setFormData, handleSubmit, isRegistrationsOpen, isLoading, isSuccess,
    discipuladoresOptions, filteredLideresOptions, situacaoOptions, parentescoOptions, handleInputChange, errors, resetForm
  };
};