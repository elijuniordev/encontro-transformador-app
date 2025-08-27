// src/hooks/useDormitoryReportLogic.ts
import { useMemo } from 'react';
import { getFemaleRooms, getMaleRooms, Room } from '@/config/rooms'; // Importa Room de rooms.ts
import { Inscription } from '@/types/supabase'; // Importa o tipo centralizado

// O tipo Participant agora é um alias para Inscription
type Participant = Inscription;

// Algoritmo de alocação de pessoas (sem alterações aqui)
const alocarPessoas = (pessoas: Participant[], quartosTemplate: Room[]) => {
    const quartos = JSON.parse(JSON.stringify(quartosTemplate)) as Room[];
    const alocados = new Set<string>();

    const tentarAlocarGrupo = (grupo: Participant[]) => {
        if (grupo.length === 0 || alocados.has(grupo[0].id)) return;
        let melhorQuarto: Room | null = null;
        let menorEspacoLivre = Infinity;

        for (const quarto of quartos) {
            const espacoLivre = quarto.capacidade - quarto.ocupantes.length;
            if (espacoLivre >= grupo.length && espacoLivre < menorEspacoLivre) {
                melhorQuarto = quarto;
                menorEspacoLivre = espacoLivre;
            }
        }

        if (melhorQuarto) {
            melhorQuarto.ocupantes.push(...grupo);
            grupo.forEach(p => alocados.add(p.id));
        }
    };

    const gruposPorCelula = Object.values(pessoas.reduce((acc, p) => {
        const key = p.lider || `sem-celula-${p.id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {} as Record<string, Participant[]>)).sort((a, b) => b.length - a.length);

    for (const celula of gruposPorCelula.filter(c => c.length > 1)) {
        tentarAlocarGrupo(celula);
    }

    const restantes = pessoas.filter(p => !alocados.has(p.id));
    const gruposPorDiscipulado = Object.values(restantes.reduce((acc, p) => {
        const key = p.discipuladores || `sem-discipulado-${p.id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(p);
        return acc;
    }, {} as Record<string, Participant[]>)).sort((a, b) => b.length - a.length);

    for (const discipulado of gruposPorDiscipulado.filter(d => d.length > 1)) {
        tentarAlocarGrupo(discipulado);
    }

    const individuosFinais = pessoas.filter(p => !alocados.has(p.id));
    for (const pessoa of individuosFinais) {
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
    if (!showReport) return null;

    const participants = inscriptions.filter(p => p.irmao_voce_e !== 'Cozinha');
    const homens = participants.filter(p => p.sexo === 'masculino');
    const mulheres = participants.filter(p => p.sexo === 'feminino');

    const alocacaoHomens = alocarPessoas(homens, getMaleRooms());
    const alocacaoMulheres = alocarPessoas(mulheres, getFemaleRooms());

    return {
      homensAlocados: alocacaoHomens.quartosAlocados,
      mulheresAlocadas: alocacaoMulheres.quartosAlocados,
      homensNaoAlocados: alocacaoHomens.naoAlocados,
      mulheresNaoAlocados: alocacaoMulheres.naoAlocados,
    };
  }, [inscriptions, showReport]);
};