// src/config/rooms.ts
import { Room } from '@/types/dormitory'; // Importa o tipo centralizado

// Estrutura dos quartos femininos (1 a 4), ordenada do maior para o menor
export const getFemaleRooms = (): Room[] => [
    { nome: 'Quarto 6', capacidade: 12, ocupantes: [] },
    { nome: 'Quarto 1', capacidade: 10, ocupantes: [] },
    { nome: 'Quarto 2', capacidade: 10, ocupantes: [] },
    { nome: 'Quarto 3', capacidade: 10, ocupantes: [] },
    { nome: 'Quarto 5', capacidade: 10, ocupantes: [] },
    { nome: 'Quarto 4', capacidade: 8, ocupantes: [] },
];

// Estrutura dos quartos masculinos (5 a 9), ordenada do maior para o menor
export const getMaleRooms = (): Room[] => [
    { nome: 'Quarto 8', capacidade: 12, ocupantes: [] },
    { nome: 'Quarto 9', capacidade: 12, ocupantes: [] },
    { nome: 'Quarto 7', capacidade: 8, ocupantes: [] },
];