// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS, PARENTESCO_OPTIONS } from "@/config/options";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "@/lib/utils";
import { eventDetails } from "@/config/eventDetails";
import { InscriptionFormData } from "@/types/forms"; // Importa o tipo centralizado
import { inscriptionSchema } from "@/lib/validations/inscriptionSchema";
import { ZodError } from "zod";

// A definição local de ValidationErrors permanece, pois só é usada aqui.
type ValidationErrors = {
  [key: string]: string | undefined;
};

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
  const [errors, setErrors] = useState<ValidationErrors>({});

  const discipuladoresOptions = useMemo(() => DISCIPULADORES_OPTIONS.sort((a, b) => a.localeCompare(b, 'pt-BR')), []);
  const lideresMap = useMemo(() => LIDERES_MAP, []);
  const situacaoOptions = useMemo(() => IRMAO_VOCE_E_OPTIONS, []);
  const parentescoOptions = useMemo(() => PARENTESCO_OPTIONS, []);
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

  // CORREÇÃO: Envolve validateForm em useCallback
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
      const isStaff = ["Cozinha"].includes(formData.situacao);
      const isChild = formData.situacao === 'Criança';
      const isEncontrista = formData.situacao === 'Encontrista';

      const calculateValue = () => {
        if (isChild) {
            const age = parseInt(formData.idade || '0', 10);
            if (age <= eventDetails.childFreeCutoffAge) return 0.00;
            if (age > eventDetails.childFreeCutoffAge && age <= eventDetails.childValueCutoffAge) return eventDetails.childValue;
        }
        return eventDetails.fullValue;
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
        valor: finalValue,
        acompanhante_nome: isChild ? formData.nomeAcompanhante?.toUpperCase() : null,
        acompanhante_parentesco: isChild ? formData.parentescoAcompanhante : null,
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
  }, [formData, isRegistrationsOpen, toast, validateForm]); // CORREÇÃO: Adiciona validateForm à lista de dependências

  return {
    formData, setFormData, handleSubmit, isRegistrationsOpen, isLoading, isSuccess,
    discipuladoresOptions, filteredLideresOptions, situacaoOptions, parentescoOptions, handleInputChange, errors, resetForm
  };
};