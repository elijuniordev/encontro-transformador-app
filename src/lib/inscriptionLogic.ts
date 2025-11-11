// src/lib/inscriptionLogic.ts
import { InscriptionFormData } from "@/types/forms";
import { eventDetails } from "@/config/eventDetails";

/**
 * Calcula o valor total e o status inicial de pagamento com base nos dados do formulário.
 */
export const calculateInscriptionDetails = (formData: InscriptionFormData) => {
  const isPastorObreiro = formData.situacao === "Pastor, obreiro ou discipulador";
  const isExemptStaff = formData.situacao === "Cozinha";
  const isChild = formData.situacao === 'Criança';
  const isEncontrista = formData.situacao === 'Encontrista';

  let finalValue = eventDetails.fullValue;
  let paymentStatus = 'Pendente';
  let anjoGuardaFinal = (formData.nomeCompleto || "N/A").toUpperCase();

  // 1. Lógica de Preços e Status
  if (isChild) {
    const age = parseInt(formData.idade || '0', 10);
    if (age <= eventDetails.childFreeCutoffAge) {
      finalValue = 0.00;
      paymentStatus = 'Isento';
    } else if (age <= eventDetails.childValueCutoffAge) {
      finalValue = eventDetails.childValue;
    }
    anjoGuardaFinal = `${formData.nomeAcompanhante} (${formData.parentescoAcompanhante})`.toUpperCase();
  }

  if (isExemptStaff || isPastorObreiro) { 
    finalValue = 0.00;
    paymentStatus = 'Isento';
  }

  // 2. Lógica do Anjo da Guarda/Discipulador
  if (isEncontrista) {
    anjoGuardaFinal = (formData.anjoGuarda || "N/A").toUpperCase();
  }
  
  const discipuladoresFinal = (isPastorObreiro || isExemptStaff) 
    ? formData.nomeCompleto.toUpperCase() 
    : formData.discipuladores;
    
  const liderFinal = (isPastorObreiro || isExemptStaff) 
    ? formData.nomeCompleto.toUpperCase() 
    : formData.lider;

  // 3. Montagem do objeto final de inserção (Database-ready)
  const inscriptionData = {
    nome_completo: formData.nomeCompleto.toUpperCase(),
    anjo_guarda: anjoGuardaFinal,
    sexo: formData.sexo,
    idade: formData.idade, 
    whatsapp: formData.whatsapp,
    discipuladores: discipuladoresFinal,
    lider: liderFinal,
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
  
  return inscriptionData;
};