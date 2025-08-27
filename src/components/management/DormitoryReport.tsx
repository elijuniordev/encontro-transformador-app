// src/components/management/DormitoryReport.tsx
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Importação correta
import { BedDouble, User } from "lucide-react"; // Apenas ícones usados

// Tipagem para os participantes
interface Participant {
  id: string;
  nome_completo: string;
  sexo: string;
  lider: string;
  discipuladores: string;
  irmao_voce_e: string;
}

// Tipagem para a estrutura dos quartos
interface Room {
  nome: string;
  capacidade: number;
  ocupantes: Participant[];
}

interface DormitoryReportProps {
  inscriptions: Participant[];
}

const DormitoryReport: React.FC<DormitoryReportProps> = ({ inscriptions }) => {
  const [showReport, setShowReport] = useState(false);

  // Define a estrutura e capacidade dos quartos conforme especificado
  const getInitialRooms = (): Room[] => [
    { nome: 'Quarto 1', capacidade: 12, ocupantes: [] },
    { nome: 'Quarto 2', capacidade: 6, ocupantes: [] },
    { nome: 'Quarto 3', capacidade: 4, ocupantes: [] },
    { nome: 'Quarto 4', capacidade: 6, ocupantes: [] },
    { nome: 'Quarto 5', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 6', capacidade: 6, ocupantes: [] },
    { nome: 'Quarto 7', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 8', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 9', capacidade: 6, ocupantes: [] },
    { nome: 'Quarto 10', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 11', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 12', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 13', capacidade: 8, ocupantes: [] },
  ];

  const { homensAlocados, mulheresAlocadas, homensNaoAlocados, mulheresNaoAlocadas } = useMemo(() => {
    if (!showReport) {
      return { homensAlocados: [], mulheresAlocadas: [], homensNaoAlocados: [], mulheresNaoAlocadas: [] };
    }

    // 1. Filtrar participantes (excluir cozinha)
    const participants = inscriptions.filter(p => p.irmao_voce_e !== 'Cozinha');
    const homens = participants.filter(p => p.sexo === 'masculino');
    const mulheres = participants.filter(p => p.sexo === 'feminino');

    // Função de alocação
    const alocarPessoas = (pessoas: Participant[], quartos: Room[]) => {
      const alocados = new Set<string>();
      
      // Agrupar por célula (líder)
      const gruposPorCelula = pessoas.reduce((acc, p) => {
        if (!acc[p.lider]) acc[p.lider] = [];
        acc[p.lider].push(p);
        return acc;
      }, {} as Record<string, Participant[]>);
      
      // Ordenar células por tamanho (maior para menor)
      const celulasOrdenadas = Object.values(gruposPorCelula).sort((a, b) => b.length - a.length);

      // 1ª Prioridade: Alocar células inteiras
      for (const celula of celulasOrdenadas) {
        if (alocados.has(celula[0].id)) continue;

        for (const quarto of quartos) {
          if (quarto.capacidade - quarto.ocupantes.length >= celula.length) {
            quarto.ocupantes.push(...celula);
            celula.forEach(p => alocados.add(p.id));
            break;
          }
        }
      }

      // 2ª Prioridade: Alocar por discipulado para preencher vagas
      const pessoasNaoAlocadasAinda = pessoas.filter(p => !alocados.has(p.id));
      const discipuladosOrdenados = Object.values(
        pessoasNaoAlocadasAinda.reduce((acc, p) => {
          if (!acc[p.discipuladores]) acc[p.discipuladores] = [];
          acc[p.discipuladores].push(p);
          return acc;
        }, {} as Record<string, Participant[]>)
      ).sort((a, b) => b.length - a.length);
      
      for (const discipulado of discipuladosOrdenados) {
        for (const pessoa of discipulado) {
          if (alocados.has(pessoa.id)) continue;
          for (const quarto of quartos) {
            if (quarto.ocupantes.length < quarto.capacidade) {
              quarto.ocupantes.push(pessoa);
              alocados.add(pessoa.id);
              break;
            }
          }
        }
      }

      // Alocar restantes em qualquer vaga
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

    const { quartosAlocados: homensAlocados, naoAlocados: homensNaoAlocados } = alocarPessoas(homens, getInitialRooms());
    const { quartosAlocados: mulheresAlocadas, naoAlocados: mulheresNaoAlocadas } = alocarPessoas(mulheres, getInitialRooms());

    return { homensAlocados, mulheresAlocadas, homensNaoAlocados, mulheresNaoAlocadas };
  }, [inscriptions, showReport]);

  return (
    <Card className="shadow-peaceful mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            Relatório de Dormitórios
          </div>
          <Button onClick={() => setShowReport(!showReport)}>
            {showReport ? "Ocultar Relatório" : "Gerar Relatório"}
          </Button>
        </CardTitle>
      </CardHeader>
      {showReport && (
        <CardContent>
          {/* SEÇÃO MASCULINA */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">Dormitórios Masculinos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homensAlocados.map(quarto => (
                <Card key={`homens-${quarto.nome}`} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{quarto.nome}</span>
                      <Badge variant="secondary">{quarto.ocupantes.length} / {quarto.capacidade}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul>
                      {quarto.ocupantes.map(p => (
                        <li key={p.id} className="text-sm mb-2 p-2 rounded bg-gray-50 border-l-4 border-blue-300">
                          <p className="font-semibold flex items-center gap-2"><User className="h-4 w-4" />{p.nome_completo}</p>
                          <p className="text-xs text-muted-foreground pl-6">Líder: {p.lider}</p>
                          <p className="text-xs text-muted-foreground pl-6">Discipulado: {p.discipuladores}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            {homensNaoAlocados.length > 0 && (
                <Card className="mt-6 border-red-500 bg-red-50">
                    <CardHeader><CardTitle className="text-red-700">Homens Não Alocados ({homensNaoAlocados.length})</CardTitle></CardHeader>
                    <CardContent>
                        <ul>{homensNaoAlocados.map(p => <li key={p.id}>{p.nome_completo}</li>)}</ul>
                    </CardContent>
                </Card>
            )}
          </div>

          {/* SEÇÃO FEMININA */}
          <div>
            <h3 className="text-2xl font-bold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">Dormitórios Femininos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mulheresAlocadas.map(quarto => (
                <Card key={`mulheres-${quarto.nome}`} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{quarto.nome}</span>
                      <Badge variant="secondary">{quarto.ocupantes.length} / {quarto.capacidade}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul>
                      {quarto.ocupantes.map(p => (
                        <li key={p.id} className="text-sm mb-2 p-2 rounded bg-gray-50 border-l-4 border-pink-300">
                          <p className="font-semibold flex items-center gap-2"><User className="h-4 w-4" />{p.nome_completo}</p>
                          <p className="text-xs text-muted-foreground pl-6">Líder: {p.lider}</p>
                          <p className="text-xs text-muted-foreground pl-6">Discipulado: {p.discipuladores}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            {mulheresNaoAlocadas.length > 0 && (
                <Card className="mt-6 border-red-500 bg-red-50">
                    <CardHeader><CardTitle className="text-red-700">Mulheres Não Alocadas ({mulheresNaoAlocadas.length})</CardTitle></CardHeader>
                    <CardContent>
                        <ul>{mulheresNaoAlocadas.map(p => <li key={p.id}>{p.nome_completo}</li>)}</ul>
                    </CardContent>
                </Card>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DormitoryReport;