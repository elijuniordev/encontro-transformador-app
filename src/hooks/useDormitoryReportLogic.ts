// src/hooks/useDormitoryReportLogic.ts
import { useMemo, useState } from "react";
import { Inscription } from "@/types/supabase";

interface Bloco {
  nome: string;
  capacidade: number;
  genero: 'MASCULINO' | 'FEMININO';
}

interface Quarto {
  genero: string;
  nome: string;
  capacidade: number;
  pessoas: Inscription[];
  vagas: number;
}

const BLOCOS: Bloco[] = [
  { nome: 'Bloco A', capacidade: 12, genero: 'MASCULINO' },
  { nome: 'Bloco B', capacidade: 10, genero: 'FEMININO' },
  { nome: 'Bloco C', capacidade: 10, genero: 'MASCULINO' },
  { nome: 'Bloco D', capacidade: 8, genero: 'FEMININO' },
  { nome: 'Bloco E', capacidade: 8, genero: 'MASCULINO' },
  { nome: 'Bloco F', capacidade: 6, genero: 'FEMININO' },
  { nome: 'Bloco G', capacidade: 6, genero: 'MASCULINO' },
];

export const useDormitoryReportLogic = (inscriptions: Inscription[]) => {
  const [reportType, setReportType] = useState<'individual' | 'dormitory'>('dormitory');

  const dormitoriesReport = useMemo(() => {
    // Filtra apenas Encontristas e Equipe Confirmados para alocação
    const peopleToAllocate = inscriptions.filter(
      (p) =>
        ["Encontrista", "Equipe", "Pastor, obreiro ou discipulador"].includes(p.irmao_voce_e) &&
        p.status_pagamento === "Confirmado"
    );

    const masculino = peopleToAllocate.filter(p => p.sexo === 'masculino');
    const feminino = peopleToAllocate.filter(p => p.sexo === 'feminino');

    // Inicializa quartos com base nos blocos e suas capacidades
    const initialQuartos: Quarto[] = BLOCOS.flatMap(bloco =>
      Array.from({ length: Math.ceil(bloco.capacidade / 4) }, (_, i) => ({
        nome: `${bloco.nome} - Quarto ${i + 1}`,
        capacidade: 4, // Assume 4 pessoas por quarto dentro de um bloco
        pessoas: [],
        vagas: 4,
        genero: bloco.genero, // Adiciona o gênero ao quarto
      }))
    );

    // Função principal de alocação
    const alocarPessoasEmBloco = (pessoas: Inscription[], quartosPorGenero: Quarto[]) => {
      // 1. Agrupar pessoas por discipulador para tentar mantê-los juntos
      const gruposPorDiscipulador: { [key: string]: Inscription[] } = {};
      pessoas.forEach(pessoa => {
        const discipulador = pessoa.discipuladores || 'SEM_DISCIPULADOR';
        if (!gruposPorDiscipulador[discipulador]) {
          gruposPorDiscipulador[discipulador] = [];
        }
        gruposPorDiscipulador[discipulador].push(pessoa);
      });

      // 2. Tentar alocar grupos completos em quartos
      Object.values(gruposPorDiscipulador).forEach(grupo => {
        let grupoAlocado = false;
        // Prioriza quartos com vagas suficientes para o grupo inteiro
        for (const quarto of quartosPorGenero) {
          if (quarto.vagas >= grupo.length) {
            quarto.pessoas.push(...grupo);
            quarto.vagas -= grupo.length;
            grupoAlocado = true;
            break;
          }
        }

        // Se o grupo não couber em um único quarto, alocar um por um
        if (!grupoAlocado) {
          grupo.forEach(pessoa => {
            // Tenta encontrar um quarto com pelo menos 1 vaga
            let pessoaAlocada = false;
            for (const quarto of quartosPorGenero) {
              if (quarto.vagas > 0) {
                quarto.pessoas.push(pessoa);
                quarto.vagas--;
                pessoaAlocada = true;
                break;
              }
            }
            // Se não houver vaga em nenhum quarto existente, idealmente deveríamos criar mais quartos ou indicar lotação
            // Para este caso, a pessoa pode ficar sem alocação ou ser colocada em um quarto excedente.
            // Aqui, a lógica assume que teremos quartos suficientes ou que o excedente será tratado.
          });
        }
      });
    };

    // Filtra quartos por gênero antes de alocar
    const quartosMasculinos = initialQuartos.filter(q => q.genero === 'MASCULINO');
    const quartosFemininos = initialQuartos.filter(q => q.genero === 'FEMININO');

    // Aloca as pessoas
    alocarPessoasEmBloco(masculino, quartosMasculinos);
    alocarPessoasEmBloco(feminino, quartosFemininos);

    // Filtra quartos que foram realmente utilizados e calcula o total de vagas
    const finalQuartos = initialQuartos.filter(q => q.pessoas.length > 0);

    const totalVagasUtilizadas = finalQuartos.reduce((sum, quarto) => sum + quarto.pessoas.length, 0);
    const totalCapacidadeDisponivel = initialQuartos.reduce((sum, quarto) => sum + quarto.capacidade, 0);

    return {
      quartos: finalQuartos,
      totalAlocados: totalVagasUtilizadas,
      totalCapacidade: totalCapacidadeDisponivel,
      naoAlocados: peopleToAllocate.length - totalVagasUtilizadas,
    };
  }, [inscriptions]);

  return {
    dormitoriesReport,
    reportType,
    setReportType,
  };
};