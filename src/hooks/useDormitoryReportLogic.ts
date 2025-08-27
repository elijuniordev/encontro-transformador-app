// src/hooks/useDormitoryReportLogic.ts
import { useMemo } from 'react';
import { getAllRooms, Room } from '@/config/rooms';
import { Inscription } from '@/types/supabase';

type Participant = Inscription;

/**
 * Aloca um grupo de pessoas em um bloco específico de quartos.
 * Esta função permanece a mesma, pois a lógica de preenchimento dos quartos é eficiente.
 */
const alocarPessoasEmBloco = (pessoas: Participant[], quartosDoBloco: Room[]): { quartosAlocados: Room[], naoAlocados: Participant[] } => {
    const quartos = JSON.parse(JSON.stringify(quartosDoBloco)) as Room[];
    const alocados = new Set<string>();

    // Tenta alocar por célula
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

    // Aloca os restantes individualmente
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
    const totalCapacidade = allRoomsTemplate.reduce((sum, room) => sum + room.capacidade, 0);

    const participantes = inscriptions.filter(p => p.irmao_voce_e !== 'Cozinha');
    const homens = participantes.filter(p => p.sexo.toLowerCase() === 'masculino');
    const mulheres = participantes.filter(p => p.sexo.toLowerCase() === 'feminino');

    // Determina qual grupo (homens ou mulheres) é maior
    const grupoMaior = mulheres.length >= homens.length ? 'feminino' : 'masculino';

    // Calcula a proporção de vagas necessárias para o grupo maior
    const proporcaoGrupoMaior = participantes.length > 0 ? (grupoMaior === 'feminino' ? mulheres.length : homens.length) / participantes.length : 0;
    
    let capacidadeAcumulada = 0;
    let indiceDivisao = 0;
    
    // Encontra o ponto de divisão dos quartos com base na proporção
    for (let i = 0; i < allRoomsTemplate.length; i++) {
      capacidadeAcumulada += allRoomsTemplate[i].capacidade;
      if (capacidadeAcumulada / totalCapacidade >= proporcaoGrupoMaior) {
        indiceDivisao = i + 1;
        break;
      }
    }
    
    // Garante que a divisão não deixe um grupo sem quartos se ambos existirem
    if (homens.length > 0 && mulheres.length > 0) {
        if (indiceDivisao === 0) indiceDivisao = 1;
        if (indiceDivisao === allRoomsTemplate.length) indiceDivisao = allRoomsTemplate.length - 1;
    }

    // Divide os quartos nos dois blocos
    const bloco1 = allRoomsTemplate.slice(0, indiceDivisao);
    const bloco2 = allRoomsTemplate.slice(indiceDivisao);

    const blocoFeminino = grupoMaior === 'feminino' ? bloco1 : bloco2;
    const blocoMasculino = grupoMaior === 'masculino' ? bloco1 : bloco2;

    // Roda o algoritmo de alocação para cada bloco
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