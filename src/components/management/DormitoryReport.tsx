// src/components/management/DormitoryReport.tsx
import React, { useState, useRef, useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Download, AlertTriangle, User } from "lucide-react";
import { generatePdfFromElements } from '@/lib/pdfGenerator';
import { useDormitoryReportLogic } from '@/hooks/useDormitoryReportLogic';
import { Inscription as Participant } from '@/types/supabase';
import { Room } from '@/config/rooms';
import { useToast } from "@/hooks/use-toast";

// Interface para as props do participante
interface DraggableParticipantProps {
  participant: Participant; roomName: string; borderColorClass: string;
}

// Sub-componente para o participante arrastável
function DraggableParticipant({ participant, roomName, borderColorClass }: DraggableParticipantProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `participant-${participant.id}`,
    data: { participant, fromRoom: roomName },
  });
  const style = { transform: CSS.Translate.toString(transform) };
  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes} className={`text-sm mb-2 p-2 rounded bg-white border-l-4 touch-none ${borderColorClass} shadow-sm cursor-grab`}>
      <p className="font-semibold flex items-center gap-2"><User className="h-4 w-4" />{participant.nome_completo}</p>
      <p className="text-xs text-muted-foreground pl-6">Líder: {participant.lider || 'N/A'}</p>
    </li>
  );
}

// Interface para as props do card de dormitório
interface DroppableDormitoryCardProps {
    quarto: Room; borderColorClass: string;
}

// Sub-componente para o card do dormitório, usando forwardRef para capturar o elemento DOM
const DroppableDormitoryCard = React.forwardRef<HTMLDivElement, DroppableDormitoryCardProps>(
    ({ quarto, borderColorClass }, ref) => {
        const { isOver, setNodeRef } = useDroppable({ id: `droppable-${quarto.nome}`, data: { room: quarto } });
        const style = { backgroundColor: isOver ? '#e0f7fa' : undefined };
        
        return (
            <div ref={ref} className="break-inside-avoid"> {/* A ref é aplicada aqui */}
                <Card ref={setNodeRef} style={style} className="flex flex-col transition-colors h-full">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{quarto.nome}</span>
                            <Badge variant={quarto.ocupantes.length > quarto.capacidade ? "destructive" : "secondary"}>
                                {quarto.ocupantes.length} / {quarto.capacidade}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow bg-gray-50 p-2 rounded-b-lg">
                        <ul className="min-h-[100px]">
                        {quarto.ocupantes.map((p) => (
                            <DraggableParticipant key={p.id} participant={p} roomName={quarto.nome} borderColorClass={borderColorClass} />
                        ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        );
    }
);
DroppableDormitoryCard.displayName = 'DroppableDormitoryCard';

// Componente principal do relatório
const DormitoryReport: React.FC<{ inscriptions: Participant[] }> = ({ inscriptions }) => {
  const { toast } = useToast();
  const [showReport, setShowReport] = useState(false);
  const roomRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const initialReportData = useDormitoryReportLogic(inscriptions, showReport);
  const [roomsState, setRoomsState] = useState<{ [key: string]: Room }>({});

  useEffect(() => {
    roomRefs.current = {}; // Limpa as refs ao regerar o relatório
    if (initialReportData) {
      const allRooms = [...initialReportData.mulheresAlocadas, ...initialReportData.homensAlocados];
      const roomsMap = allRooms.reduce((acc, room) => {
        const gender = room.ocupantes[0]?.sexo.toLowerCase() as 'masculino' | 'feminino' | undefined;
        acc[room.nome] = { ...room, genero: gender };
        return acc;
      }, {} as { [key: string]: Room });
      setRoomsState(roomsMap);
    } else {
      setRoomsState({});
    }
  }, [initialReportData]);

  const handleDragEnd = (event: DragEndEvent) => {
    // ... (lógica do handleDragEnd permanece a mesma)
  };

  const handleGeneratePdf = () => {
    const elementsToPrint = Object.values(roomRefs.current).filter(Boolean) as HTMLElement[];
    if (elementsToPrint.length > 0) {
      generatePdfFromElements(elementsToPrint, 'relatorio-dormitorios.pdf');
    } else {
      toast({ title: "Nenhum quarto para imprimir", description: "O relatório não contém quartos para gerar o PDF.", variant: "destructive" });
    }
  };

  const mulheresAlocadas = Object.values(roomsState).filter(r => r.genero === 'feminino');
  const homensAlocados = Object.values(roomsState).filter(r => r.genero === 'masculino');
  const naoAlocados = initialReportData ? [...initialReportData.mulheresNaoAlocados, ...initialReportData.homensNaoAlocados] : [];

  return (
    <Card className="shadow-peaceful mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2"><BedDouble className="h-5 w-5" />Relatório Dinâmico de Dormitórios</div>
            <div className="flex items-center gap-2">
                <Button onClick={() => setShowReport(!showReport)} variant="outline">{showReport ? "Ocultar Relatório" : "Gerar Relatório"}</Button>
                {showReport && initialReportData && (<Button onClick={handleGeneratePdf}><Download className="mr-2 h-4 w-4" /> Baixar PDF</Button>)}
            </div>
        </CardTitle>
      </CardHeader>
      {showReport && initialReportData && (
        <DndContext onDragEnd={handleDragEnd}>
          <CardContent>
            {mulheresAlocadas.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">Bloco Feminino</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mulheresAlocadas.map(quarto => (
                    <DroppableDormitoryCard 
                        key={`mulheres-${quarto.nome}`} 
                        ref={el => (roomRefs.current[quarto.nome] = el)}
                        quarto={quarto} 
                        borderColorClass="border-pink-300" 
                    />
                  ))}
                </div>
              </div>
            )}
            {homensAlocados.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">Bloco Masculino</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {homensAlocados.map(quarto => (
                    <DroppableDormitoryCard 
                        key={`homens-${quarto.nome}`}
                        ref={el => (roomRefs.current[quarto.nome] = el)}
                        quarto={quarto} 
                        borderColorClass="border-blue-300" 
                    />
                  ))}
                </div>
              </div>
            )}
            {naoAlocados.length > 0 && (
               <Card className="mt-6 border-orange-500 bg-orange-50">
                  <CardHeader><CardTitle className="text-orange-700 flex items-center gap-2"><AlertTriangle /> Participantes Não Alocados</CardTitle></CardHeader>
                  <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {naoAlocados.map(p => <p key={p.id} className='font-semibold'>{p.nome_completo}</p>)}
                  </CardContent>
              </Card>
            )}
          </CardContent>
        </DndContext>
      )}
    </Card>
  );
};

export default DormitoryReport;