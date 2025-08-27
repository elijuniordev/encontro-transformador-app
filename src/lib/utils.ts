// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// SUBSTITUA A FUNÇÃO ANTIGA POR ESTA VERSÃO CORRIGIDA
export function formatPhoneNumber(value: string): string {
  // Se o valor for nulo ou indefinido, retorne uma string vazia
  if (!value) return "";

  // 1. Remove tudo que não é dígito
  const digitsOnly = value.replace(/\D/g, "");

  // 2. Limita a 11 dígitos (máximo para celular com DDD)
  const clippedValue = digitsOnly.slice(0, 11);

  // 3. Aplica a máscara de forma progressiva
  if (clippedValue.length <= 2) {
    // Retorna (XX
    return `(${clippedValue}`;
  }
  
  if (clippedValue.length <= 7) {
    // Retorna (XX) XXXXX
    return `(${clippedValue.slice(0, 2)}) ${clippedValue.slice(2)}`;
  }

  // Retorna (XX) XXXXX-XXXX
  return `(${clippedValue.slice(0, 2)}) ${clippedValue.slice(2, 7)}-${clippedValue.slice(7)}`;
}