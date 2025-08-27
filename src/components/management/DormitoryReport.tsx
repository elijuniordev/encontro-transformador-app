// src/components/management/DormitoryReport.tsx
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Download } from "lucide-react";
import { generatePdfFromElement } from '@/lib/pdfGenerator';
import { useDormitoryReportLogic } from '@/hooks/useDormitoryReportLogic';
import DormitoryCard from './DormitoryCard';
import { Inscription as Participant } from '@/types/supabase';

interface DormitoryReportProps {
  inscriptions: Participant[];
}

const DormitoryReport: React.FC<DormitoryReportProps> = ({ inscriptions }) => {
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const reportData = useDormitoryReportLogic(inscriptions, showReport);

  const handleGeneratePdf = () => {
    if (reportRef.current) {
      generatePdfFromElement(reportRef.current, 'relatorio-dormitorios-encontro.pdf');
    }
  };

  return (
    <Card className="shadow-peaceful mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            Relatório Dinâmico de Dormitórios
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowReport(!showReport)} variant="outline">
              {showReport ? "Ocultar Relatório" : "Gerar Relatório"}
            </Button>
            {showReport && reportData && (
              <Button onClick={handleGeneratePdf}>
                <Download className="mr-2 h-4 w-4" /> Baixar PDF
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      {showReport && reportData && (
        <CardContent ref={reportRef}>
          {/* SEÇÃO FEMININA (só renderiza se houver mulheres) */}
          {reportData.mulheresAlocadas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">Bloco Feminino</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportData.mulheresAlocadas.map(quarto => (
                  <DormitoryCard key={`mulheres-${quarto.nome}`} quarto={quarto} borderColorClass="border-pink-300" />
                ))}
              </div>
            </div>
          )}
          
          {/* SEÇÃO MASCULINA (só renderiza se houver homens) */}
          {reportData.homensAlocados.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">Bloco Masculino</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportData.homensAlocados.map(quarto => (
                  <DormitoryCard key={`homens-${quarto.nome}`} quarto={quarto} borderColorClass="border-blue-300" />
                ))}
              </div>
            </div>
          )}

          {/* RENDERIZA PESSOAS NÃO ALOCADAS (se houver) */}
          {(reportData.mulheresNaoAlocados.length > 0 || reportData.homensNaoAlocados.length > 0) && (
             <Card className="mt-6 border-red-500 bg-red-50">
                <CardHeader><CardTitle className="text-red-700">Participantes Não Alocados (Sem Vagas)</CardTitle></CardHeader>
                <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.mulheresNaoAlocados.length > 0 && (
                    <div>
                      <h4 className="font-bold text-pink-700">Mulheres:</h4>
                      <ul className="space-y-1 mt-2">
                        {reportData.mulheresNaoAlocados.map(p => <li key={p.id} className='font-semibold'>{p.nome_completo}</li>)}
                      </ul>
                    </div>
                  )}
                   {reportData.homensNaoAlocados.length > 0 && (
                    <div>
                      <h4 className="font-bold text-blue-700">Homens:</h4>
                      <ul className="space-y-1 mt-2">
                        {reportData.homensNaoAlocados.map(p => <li key={p.id} className='font-semibold'>{p.nome_completo}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
            </Card>
          )}

        </CardContent>
      )}
    </Card>
  );
};

export default DormitoryReport;