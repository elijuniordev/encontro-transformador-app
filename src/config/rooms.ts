// src/config/rooms.ts
import { Inscription } from '@/types/supabase';

export interface Room {
  nome: string;
  capacidade: number;
  ocupantes: Inscription[];
  genero?: 'masculino' | 'feminino'; // Gênero agora é opcional, será definido dinamicamente
}

// A configuração agora é apenas uma lista de quartos com suas capacidades.
// O sistema irá designar o gênero (M/F) automaticamente.
export const ROOMS_CONFIG: Room[] = [
  { nome: 'Quarto 1', capacidade: 10, ocupantes: [] },
  { nome: 'Quarto 2', capacidade: 10, ocupantes: [] },
  { nome: 'Quarto 3', capacidade: 10, ocupantes: [] },
  { nome: 'Quarto 4', capacidade: 8, ocupantes: [] },
  { nome: 'Quarto 5', capacidade: 10, ocupantes: [] },
  { nome: 'Quarto 6', capacidade: 12, ocupantes: [] },
  { nome: 'Quarto 7', capacidade: 8, ocupantes: [] },
  { nome: 'Quarto 8', capacidade: 12, ocupantes: [] },
  { nome: 'Quarto 9', capacidade: 12, ocupantes: [] },
];