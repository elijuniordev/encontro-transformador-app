// src/types/dormitory.ts

// Tipagem para os participantes do evento
export interface Participant {
  id: string;
  nome_completo: string;
  sexo: string;
  lider: string;
  discipuladores: string;
  irmao_voce_e: string;
}

// Tipagem para a estrutura dos quartos
export interface Room {
  nome: string;
  capacidade: number;
  ocupantes: Participant[];
}