// src/components/management/DormitoryReport.tsx
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Download, User } from "lucide-react";
import { generatePdfFromElement } from '@/lib/pdfGenerator';
import { useDormitoryReportLogic } from '@/hooks/useDormitoryReportLogic';
import DormitoryCard from './DormitoryCard';
import { Participant } from '@/types/dormitory'; // Importa o tipo centralizado

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
            Relatório de Dormitórios
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowReport(!showReport)} variant="outline">
              {showReport ? "Ocultar" : "Gerar Relatório"}
            </Button>
            {showReport && (
              <Button onClick={handleGeneratePdf}>
                <Download className="mr-2 h-4 w-4" /> Baixar PDF
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      {showReport && reportData && (
        <CardContent ref={reportRef}>
          {/* SEÇÃO FEMININA */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">Dormitórios Femininos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportData.mulheresAlocadas.map(quarto => (
                <DormitoryCard key={`mulheres-${quarto.nome}`} quarto={quarto} borderColorClass="border-pink-300" />
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
                <DormitoryCard key={`homens-${quarto.nome}`} quarto={quarto} borderColorClass="border-blue-300" />
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