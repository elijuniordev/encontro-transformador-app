// src/hooks/useDormitoryReportLogic.ts
import { useMemo } from 'react';
import { getAllRooms, Room } from '@/config/rooms';
import { Inscription } from '@/types/supabase';

type Participant = Inscription;

// A função de alocação interna para um bloco de quartos permanece a mesma
const alocarPessoasEmBloco = (pessoas: Participant[], quartosDoBloco: Room[]): { quartosAlocados: Room[], naoAlocados: Participant[] } => {
    const quartos = JSON.parse(JSON.stringify(quartosDoBloco)) as Room[];
    const alocados = new Set<string>();

    const gruposPorCelula = Object.values(pessoas.reduce((acc, p) => {
        const key = p.lider || `sem-celula-${p.id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {} as Record<string, Participant[]>)).sort((a, b) => b.length - a.length);

    for (const celula of gruposPorCelula) {
        let melhorQuarto: Room | null = null;
        let menorEspacoLivre = Infinity;

        for (const quarto of quartos) {
            const espacoLivre = quarto.capacidade - quarto.ocupantes.length;
            if (espacoLivre >= celula.length && espacoLivre < menorEspacoLivre) {
                melhorQuarto = quarto;
                menorEspacoLivre = espacoLivre;
            }
        }
        if (melhorQuarto) {
            melhorQuarto.ocupantes.push(...celula);
            celula.forEach(p => alocados.add(p.id));
        }
    }

    const restantes = pessoas.filter(p => !alocados.has(p.id));
    for (const pessoa of restantes) {
        for (const quarto of quartos) {
            if (quarto.ocupantes.length < quarto.capacidade) {
                quarto.ocupantes.push(pessoa);
                alocados.add(pessoa.id);
                break;
            }
        }
    }

    const naoAlocados = pessoas.filter(p => !alocados.has(p.id));
    return { quartosAlocados: quartos.filter(q => q.ocupantes.length > 0), naoAlocados };
};

export const useDormitoryReportLogic = (inscriptions: Participant[], showReport: boolean) => {
  return useMemo(() => {
    if (!showReport || inscriptions.length === 0) return null;

    const allRoomsTemplate = getAllRooms();

    const participantes = inscriptions.filter(p => p.irmao_voce_e !== 'Cozinha');
    const homens = participantes.filter(p => p.sexo.toLowerCase() === 'masculino');
    const mulheres = participantes.filter(p => p.sexo.toLowerCase() === 'feminino');

    let capacidadeAcumulada = 0;
    let indiceDivisao = 0;

    // Calcula a capacidade total necessária para as mulheres
    const capacidadeNecessariaMulheres = mulheres.length;

    // Itera sobre os quartos em sequência para encontrar o ponto de divisão
    for (let i = 0; i < allRoomsTemplate.length; i++) {
      capacidadeAcumulada += allRoomsTemplate[i].capacidade;
      if (capacidadeAcumulada >= capacidadeNecessariaMulheres) {
        indiceDivisao = i + 1; // O próximo quarto pertencerá ao outro bloco
        break;
      }
    }

    // Se a capacidade acumulada nunca atingiu o necessário, todas as mulheres ficam no primeiro bloco
    // e os homens (se houver) não terão quartos. Ou o inverso, se não houver mulheres.
    if (capacidadeAcumulada < capacidadeNecessariaMulheres) {
        indiceDivisao = allRoomsTemplate.length;
    }

    // Cria os blocos sequenciais
    const blocoFeminino = allRoomsTemplate.slice(0, indiceDivisao);
    const blocoMasculino = allRoomsTemplate.slice(indiceDivisao);

    // Roda o algoritmo de alocação para cada grupo em seu respectivo bloco
    const alocacaoMulheres = alocarPessoasEmBloco(mulheres, blocoFeminino);
    const alocacaoHomens = alocarPessoasEmBloco(homens, blocoMasculino);

    return {
      mulheresAlocadas: alocacaoMulheres.quartosAlocados,
      homensAlocados: alocacaoHomens.quartosAlocados,
      mulheresNaoAlocados: alocacaoMulheres.naoAlocados,
      homensNaoAlocados: alocacaoHomens.naoAlocados,
    };
  }, [inscriptions, showReport]);
};