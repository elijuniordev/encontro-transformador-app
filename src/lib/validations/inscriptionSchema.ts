// src/lib/validations/inscriptionSchema.ts
import { z } from "zod";

const whatsappSchema = z.string().trim().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato de WhatsApp inválido. Use (XX) XXXXX-XXXX.");

export const inscriptionSchema = z.object({
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