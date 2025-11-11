// src/hooks/useInscriptionFormLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DISCIPULADORES_OPTIONS, LIDERES_MAP, IRMAO_VOCE_E_OPTIONS, PARENTESCO_OPTIONS } from "@/config/options";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "@/lib/utils";
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
  const filteredLideresOptions = useMemo(
    () => formData.discipuladores ? lideresMap[formData.discipuladores as keyof typeof lideresMap] : [],
    [formData.discipuladores, lideresMap]
  );

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from('event_settings')
        .select('registrations_open')
        .single();
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
        toast({
          title: "Existem erros no formulário",
          description: "Por favor, corrija os campos destacados.",
          variant: "destructive",
        });
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
      const inscriptionData = {
        nome_completo: formData.nomeCompleto?.trim().toUpperCase(),
        anjo_guarda: formData.anjoGuarda?.trim() || 'Não informado',
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: formData.discipuladores || null,
        lider: formData.lider || null,
        irmao_voce_e: formData.situacao,
        responsavel_1_nome: formData.nomeResponsavel1 || null,
        responsavel_1_whatsapp: formData.whatsappResponsavel1 || null,
        responsavel_2_nome: formData.nomeResponsavel2 || null,
        responsavel_2_whatsapp: formData.whatsappResponsavel2 || null,
        responsavel_3_nome: formData.nomeResponsavel3 || null,
        responsavel_3_whatsapp: formData.whatsappResponsavel3 || null,
        status_pagamento: 'Pendente',
        forma_pagamento: null,
        total_value: 200.00,
        paid_amount: 0.00,
        acompanhante_nome: formData.nomeAcompanhante || null,
        acompanhante_parentesco: formData.parentescoAcompanhante || null,
      };

      const { error } = await supabase
        .from('inscriptions')
        .insert([inscriptionData])
        .select();

      if (error) throw error;

      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua inscrição foi registrada.",
      });
      setIsSuccess(true);
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro inesperado.";
      if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
      }
      toast({
        title: "Erro na inscrição",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isRegistrationsOpen, toast, validateForm]);

  return {
    formData,
    setFormData,
    handleSubmit,
    isRegistrationsOpen,
    isLoading,
    isSuccess,
    discipuladoresOptions,
    filteredLideresOptions,
    situacaoOptions,
    parentescoOptions,
    handleInputChange,
    errors,
    resetForm,
  };
};
