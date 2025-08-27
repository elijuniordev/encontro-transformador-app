// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ADICIONE ESTA FUNÇÃO
export function formatPhoneNumber(value: string): string {
  if (!value) return "";
  
  // Remove tudo que não é dígito
  const digitsOnly = value.replace(/\D/g, "");

  // Aplica a máscara (XX) XXXXX-XXXX
  let maskedValue = "";
  if (digitsOnly.length > 0) {
    maskedValue = `(${digitsOnly.slice(0, 2)}`;
  }
  if (digitsOnly.length > 2) {
    maskedValue = `${maskedValue}) ${digitsOnly.slice(2, 7)}`;
  }
  if (digitsOnly.length > 7) {
    maskedValue = `${maskedValue}-${digitsOnly.slice(7, 11)}`;
  }

  return maskedValue;
}