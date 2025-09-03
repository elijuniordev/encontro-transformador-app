// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Adiciona a função para formatar o número de telefone
export function formatPhoneNumber(value: string): string {
  if (!value) return "";
  
  const digitsOnly = value.replace(/\D/g, "");
  const clippedValue = digitsOnly.slice(0, 11);

  if (clippedValue.length <= 2) {
    return `(${clippedValue}`;
  }
  
  if (clippedValue.length <= 6) {
    return `(${clippedValue.slice(0, 2)}) ${clippedValue.slice(2)}`;
  }
  
  if (clippedValue.length <= 10) {
    return `(${clippedValue.slice(0, 2)}) ${clippedValue.slice(2, 6)}-${clippedValue.slice(6)}`;
  }

  return `(${clippedValue.slice(0, 2)}) ${clippedValue.slice(2, 7)}-${clippedValue.slice(7)}`;
}

// Função para normalizar texto (remover acentos e converter para minúsculas)
export const normalizeText = (text?: string | null): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};