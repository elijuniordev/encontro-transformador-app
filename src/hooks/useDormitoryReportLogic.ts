// src/hooks/useDormitoryReportLogic.ts
import { useMemo } from "react";
import { Inscription, Inscription as Participant } from "@/types/supabase";
import { ROOMS_CONFIG, Room } from '@/config/rooms';

/**
 * Agrupa os participantes por uma chave (ex: 'lider' ou 'discipuladores').
 * @param participants - A lista de participantes a ser agrupada.
 * @param key - A propriedade pela qual agrupar ('lider' ou 'discipuladores').
 * @returns Um Record onde as chaves são os nomes dos grupos e os valores são listas de participantes.
 */
const groupParticipantsBy = (participants: Participant[], key: keyof Participant): Record<string, Participant[]> => {
  return participants.reduce((acc, participant) => {
    const groupKey = (participant[key] as string) || 'N/A';
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(participant);
    return acc;
  }, {} as Record<string, Participant[]>);
};

export const useDormitoryReportLogic = (inscriptions: Inscription[], shouldRun: boolean) => {
  return useMemo(() => {
    if (!shouldRun || !inscriptions) {
      return null;
    }

    const peopleToAllocate = inscriptions.filter(
      (p) =>
        ["Encontrista", "Equipe"].includes(p.irmao_voce_e) &&
        (p.status_pagamento === "Confirmado" || p.status_pagamento === "Isento")
    );

    const masculino = peopleToAllocate.filter(p => p.sexo === 'masculino');
    const feminino = peopleToAllocate.filter(p => p.sexo === 'feminino');

    const availableRooms: Room[] = JSON.parse(JSON.stringify(ROOMS_CONFIG));

    /**
     * Algoritmo de alocação dinâmica com prioridade de agrupamento.
     * Tenta alocar por Célula > Discipulado > Individualmente.
     */
    const allocateDynamically = (participants: Participant[], rooms: Room[]) => {
      const gender = participants[0]?.sexo;
      if (!gender) return;

      // 1. Agrupar por Célula (Líder) - Prioridade Máxima
      const groupsByLider = Object.values(groupParticipantsBy(participants, 'lider')).sort((a, b) => b.length - a.length);
      
      // Correção: Mude 'let' para 'const'
      const remainingParticipants = new Set(participants);

      // Tenta alocar os grupos de CÉLULA inteiros
      for (const group of groupsByLider) {
        // Encontra o melhor quarto vazio ou já iniciado que caiba o grupo
        const bestRoom = rooms.find(r => (!r.genero || r.genero === gender) && r.capacidade - r.ocupantes.length >= group.length);
        if (bestRoom) {
          if (!bestRoom.genero) bestRoom.genero = gender; // Define o gênero do quarto
          bestRoom.ocupantes.push(...group);
          group.forEach(p => remainingParticipants.delete(p)); // Remove os alocados da lista de espera
        }
      }
      
      // 2. Com os participantes restantes, agrupar por DISCIPULADO
      const participantsForDiscipuladoGrouping = Array.from(remainingParticipants);
      const groupsByDiscipulado = Object.values(groupParticipantsBy(participantsForDiscipuladoGrouping, 'discipuladores')).sort((a, b) => b.length - a.length);
      
      // Tenta alocar os grupos de DISCIPULADO inteiros
      for (const group of groupsByDiscipulado) {
        const bestRoom = rooms.find(r => (!r.genero || r.genero === gender) && r.capacidade - r.ocupantes.length >= group.length);
         if (bestRoom) {
          if (!bestRoom.genero) bestRoom.genero = gender;
          bestRoom.ocupantes.push(...group);
          group.forEach(p => remainingParticipants.delete(p));
        }
      }

      // 3. Alocar INDIVIDUALMENTE os que sobraram
      // Esta etapa garante que todos sejam alocados se houver espaço.
      for (const person of Array.from(remainingParticipants)) {
        // Busca o melhor quarto para esta pessoa com base na hierarquia
        let bestFitRoom: Room | null = null;
        let bestFitScore = -1; // -1: sem lugar, 0: quarto vazio, 1: quarto do mesmo gênero, 2: quarto com mesmo discipulado

        for (const room of rooms) {
          if (room.capacidade > room.ocupantes.length) {
            let currentScore = -1;
            if (!room.genero) {
              currentScore = 0; // Quarto vazio é uma opção
            } else if (room.genero === gender) {
              currentScore = 1; // Quarto do mesmo gênero é melhor
              if (room.ocupantes.some(p => p.discipuladores === person.discipuladores)) {
                currentScore = 2; // Quarto com mesmo discipulado é o ideal
              }
            }
            
            if (currentScore > bestFitScore) {
              bestFitScore = currentScore;
              bestFitRoom = room;
            }
          }
        }

        if (bestFitRoom) {
          if (!bestFitRoom.genero) bestFitRoom.genero = gender;
          bestFitRoom.ocupantes.push(person);
        }
      }
    };
    
    // Aloca os dois gêneros
    allocateDynamically(feminino, availableRooms);
    allocateDynamically(masculino, availableRooms);

    const allocatedIds = new Set(availableRooms.flatMap(room => room.ocupantes.map(p => p.id)));

    const mulheresNaoAlocados = feminino.filter(p => !allocatedIds.has(p.id));
    const homensNaoAlocados = masculino.filter(p => !allocatedIds.has(p.id));

    return {
      mulheresAlocadas: availableRooms.filter(r => r.genero === 'feminino' && r.ocupantes.length > 0),
      homensAlocados: availableRooms.filter(r => r.genero === 'masculino' && r.ocupantes.length > 0),
      mulheresNaoAlocados,
      homensNaoAlocados,
    };
  }, [inscriptions, shouldRun]);
};