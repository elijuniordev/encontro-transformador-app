// src/lib/validations/paymentSchema.ts
import { z } from "zod";

export const paymentSchema = z.object({
  newAmount: z.string().refine(val => /^\d+([,.]\d{1,2})?$/.test(val), {
    message: "Valor inválido. Use apenas números e vírgula/ponto para decimais.",
  }).refine(val => parseFloat(val.replace(',', '.')) > 0, {
    message: "O valor deve ser maior que zero.",
  }),
  newMethod: z.string().nonempty("Selecione uma forma de pagamento."),
});