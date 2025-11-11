// src/lib/validations/inscriptionSchema.ts
import { z } from 'zod';
// Removido 'eventDetails' pois não é mais necessário neste arquivo após a correção
// import { eventDetails } from '@/config/eventDetails'; 

// Regex para (XX) 9XXXX-XXXX (permitindo DDDs com 0)
const phoneRegex = /^\(\d{2}\) 9\d{4}-\d{4}$/;

export const inscriptionSchema = z.object({
  nomeCompleto: z.string().min(3, "Nome completo é obrigatório"),
  
  // Correção da IDADE (validação Zod)
  idade: z.string()
    .min(1, "Idade é obrigatória")
    .regex(/^\d+$/, "Idade deve ser um número") // Garante que é um número
    .refine(val => {
      const num = parseInt(val, 10);
      return num > 0; // Deve ser maior que 0 (mesma regra do banco)
    }, { message: "Idade deve ser maior que 0" })
    .refine(val => {
      const num = parseInt(val, 10);
      return num < 100; // Limite de sanidade
    }, { message: "Idade inválida" }),

  sexo: z.string().min(1, "Sexo é obrigatório"),
  whatsapp: z.string().refine(val => phoneRegex.test(val), "Whatsapp inválido. Formato esperado: (XX) 9XXXX-XXXX"),
  discipuladores: z.string().min(1, "Discipulador é obrigatório"),
  lider: z.string().min(1, "Líder é obrigatório"),
  situacao: z.string().min(1, "Situação é obrigatória"),

  // Lógica condicional
  anjoGuarda: z.string().optional(),
  nomeAcompanhante: z.string().optional(),
  parentescoAcompanhante: z.string().optional(),

  // Campos condicionais para menor de idade
  nomeResponsavel1: z.string().optional(),
  whatsappResponsavel1: z.string().optional(),
  nomeResponsavel2: z.string().optional(),
  whatsappResponsavel2: z.string().optional(),
  nomeResponsavel3: z.string().optional(),
  whatsappResponsavel3: z.string().optional(),

}).refine(data => {
  // Se for Encontrista, Anjo da Guarda é obrigatório
  if (data.situacao === 'Encontrista') {
    return data.anjoGuarda && data.anjoGuarda.length > 0;
  }
  return true;
}, {
  message: 'Anjo da guarda é obrigatório para Encontristas',
  path: ['anjoGuarda'],
})
.refine(data => {
  // Se for Criança, nome e parentesco do acompanhante são obrigatórios
  if (data.situacao === 'Criança') {
    return (data.nomeAcompanhante && data.nomeAcompanhante.length > 0) &&
           (data.parentescoAcompanhante && data.parentescoAcompanhante.length > 0);
  }
  return true;
}, {
  message: 'Nome e parentesco do acompanhante são obrigatórios para Crianças',
  path: ['nomeAcompanhante'], // Mostra o erro no primeiro campo
})
.refine(data => {
  // Se for menor de 18, pelo menos um responsável é obrigatório
  const idadeNum = parseInt(data.idade, 10);
  
  // --- INÍCIO DA CORREÇÃO ---
  // Troquei eventDetails.adultAge por 18
  if (idadeNum > 0 && idadeNum < 18) { 
  // --- FIM DA CORREÇÃO ---
  
    const hasResponsavel1 = (data.nomeResponsavel1 && data.nomeResponsavel1.length > 0) && 
                            (data.whatsappResponsavel1 && phoneRegex.test(data.whatsappResponsavel1));
    return hasResponsavel1; // Pelo menos o primeiro é obrigatório
  }
  return true;
}, {
  message: 'Pelo menos um responsável com nome e whatsapp válidos é obrigatório para menores de 18 anos',
  path: ['nomeResponsavel1'], // Mostra o erro no primeiro campo
});