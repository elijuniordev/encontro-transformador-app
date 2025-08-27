// src/components/management/DormitoryReport.tsx
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, User } from "lucide-react";

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

// Estrutura dos quartos femininos (1 a 6), ordenada do maior para o menor
const getFemaleRooms = (): Room[] => [
    { nome: 'Quarto 1', capacidade: 12, ocupantes: [] },
    { nome: 'Quarto 5', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 2', capacidade: 6, ocupantes: [] },
    { nome: 'Quarto 4', capacidade: 6, ocupantes: [] },
    { nome: 'Quarto 6', capacidade: 6, ocupantes: [] },
    { nome: 'Quarto 3', capacidade: 4, ocupantes: [] },
];

// Estrutura dos quartos masculinos (7 a 13), ordenada do maior para o menor
const getMaleRooms = (): Room[] => [
    { nome: 'Quarto 7', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 8', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 10', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 11', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 12', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 13', capacidade: 8, ocupantes: [] },
    { nome: 'Quarto 9', capacidade: 6, ocupantes: [] },
];


// Algoritmo de alocação final com coesão de célula e discipulado garantida
const alocarPessoas = (pessoas: Participant[], quartosTemplate: Room[]) => {
  const quartos = JSON.parse(JSON.stringify(quartosTemplate)) as Room[];
  const alocados = new Set<string>();

  // Função auxiliar para tentar alocar um grupo inteiro no melhor quarto possível
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

  // 1. Agrupar por Célula
  const gruposPorCelula = Object.values(pessoas.reduce((acc, p) => {
    const key = p.lider || `sem-celula-${p.id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {} as Record<string, Participant[]>)).sort((a, b) => b.length - a.length);

  // 2. Tentar alocar CÉLULAS INTEIRAS (grupos com mais de 1 pessoa)
  for (const celula of gruposPorCelula.filter(c => c.length > 1)) {
    tentarAlocarGrupo(celula);
  }

  // 3. Agrupar restantes por Discipulado
  const restantes = pessoas.filter(p => !alocados.has(p.id));
  const gruposPorDiscipulado = Object.values(restantes.reduce((acc, p) => {
    const key = p.discipuladores || `sem-discipulado-${p.id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {} as Record<string, Participant[]>)).sort((a, b) => b.length - a.length);

  // 4. Tentar alocar GRUPOS DE DISCIPULADO INTEIROS (grupos com mais de 1 pessoa)
  for (const discipulado of gruposPorDiscipulado.filter(d => d.length > 1)) {
    tentarAlocarGrupo(discipulado);
  }

  // 5. Alocar indivíduos que sobraram em qualquer vaga
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


const DormitoryReport: React.FC<DormitoryReportProps> = ({ inscriptions }) => {
  const [showReport, setShowReport] = useState(false);

  const reportData = useMemo(() => {
    if (!showReport) {
      return null;
    }

    const participants = inscriptions.filter(p => p.irmao_voce_e !== 'Cozinha');
    const homens = participants.filter(p => p.sexo === 'masculino');
    const mulheres = participants.filter(p => p.sexo === 'feminino');

    // Alocação separada por gênero
    const alocacaoHomens = alocarPessoas(homens, getMaleRooms());
    const alocacaoMulheres = alocarPessoas(mulheres, getFemaleRooms());

    return {
      homensAlocados: alocacaoHomens.quartosAlocados,
      mulheresAlocadas: alocacaoMulheres.quartosAlocados,
      homensNaoAlocados: alocacaoHomens.naoAlocados,
      mulheresNaoAlocados: alocacaoMulheres.naoAlocados,
    };
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
      {showReport && reportData && (
        <CardContent>
          {/* SEÇÃO FEMININA */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">Dormitórios Femininos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportData.mulheresAlocadas.map(quarto => (
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
                          <p className="text-xs text-muted-foreground pl-6">Líder: {p.lider || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground pl-6">Discipulado: {p.discipuladores}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            {reportData.mulheresNaoAlocados.length > 0 && (
                <Card className="mt-6 border-red-500 bg-red-50">
                    <CardHeader><CardTitle className="text-red-700">Mulheres Não Alocadas ({reportData.mulheresNaoAlocados.length})</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="pt-4 space-y-2">
                            {reportData.mulheresNaoAlocados.map(p => <li key={p.id} className='font-semibold'>{p.nome_completo} <span className='text-xs text-muted-foreground'> (Líder: {p.lider || 'N/A'}, Discipulado: {p.discipuladores})</span></li>)}
                        </ul>
                    </CardContent>
                </Card>
            )}
          </div>

          {/* SEÇÃO MASCULINA */}
          <div>
            <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">Dormitórios Masculinos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportData.homensAlocados.map(quarto => (
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
                          <p className="text-xs text-muted-foreground pl-6">Líder: {p.lider || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground pl-6">Discipulado: {p.discipuladores}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            {reportData.homensNaoAlocados.length > 0 && (
                <Card className="mt-6 border-red-500 bg-red-50">
                    <CardHeader><CardTitle className="text-red-700">Homens Não Alocados ({reportData.homensNaoAlocados.length})</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="pt-4 space-y-2">
                            {reportData.homensNaoAlocados.map(p => <li key={p.id} className='font-semibold'>{p.nome_completo} <span className='text-xs text-muted-foreground'> (Líder: {p.lider || 'N/A'}, Discipulado: {p.discipuladores})</span></li>)}
                        </ul>
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