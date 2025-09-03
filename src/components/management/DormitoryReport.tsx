// src/components/management/DormitoryReport.tsx
import React, { useState, useRef, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Download, AlertTriangle } from "lucide-react";
import { generatePdfFromElements } from '@/lib/pdfGenerator';
import { useDormitoryReportLogic } from '@/hooks/useDormitoryReportLogic';
import { Inscription as Participant } from '@/types/supabase';
import { Room } from '@/config/rooms';
import { useToast } from "@/hooks/use-toast";
import DormitoryCard from './DormitoryCard';

const DormitoryReport: React.FC<{ inscriptions: Participant[] }> = ({ inscriptions }) => {
  const { toast } = useToast();
  const [showReport, setShowReport] = useState(false);
  const roomRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const initialReportData = useDormitoryReportLogic(inscriptions, showReport);
  const [roomsState, setRoomsState] = useState<{ [key: string]: Room }>({});
  const [unallocated, setUnallocated] = useState<Participant[]>([]);

  useEffect(() => {
    roomRefs.current = {};
    if (initialReportData) {
      const allRooms = [...initialReportData.mulheresAlocadas, ...initialReportData.homensAlocados];
      const roomsMap = allRooms.reduce((acc, room) => {
        acc[room.nome] = room;
        return acc;
      }, {} as { [key: string]: Room });
      setRoomsState(roomsMap);
      setUnallocated([...initialReportData.mulheresNaoAlocados, ...initialReportData.homensNaoAlocados]);
    } else {
      setRoomsState({});
      setUnallocated([]);
    }
  }, [initialReportData]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const participant = active.data.current?.participant as Participant;
    const fromRoomName = active.data.current?.fromRoom as string;

    // Se veio da lista de não alocados
    if (fromRoomName === 'nao-alocados') {
        const toRoom = over.data.current?.room as Room;
        if (!toRoom || !participant) return;
        
        // Validação de gênero
        if (toRoom.genero !== participant.sexo) {
            toast({ title: "Movimento Inválido", description: "Não é possível mover para um bloco de sexo diferente.", variant: "destructive" });
            return;
        }

        setRoomsState(prev => {
            const newRooms = { ...prev };
            newRooms[toRoom.nome].ocupantes.push(participant);
            return newRooms;
        });
        setUnallocated(prev => prev.filter(p => p.id !== participant.id));
        return;
    }

    // Se moveu entre quartos
    const toRoom = over.data.current?.room as Room;
    if (!participant || !fromRoomName || !toRoom || fromRoomName === toRoom.nome || !roomsState[fromRoomName] || !roomsState[toRoom.nome]) return;

    if (roomsState[fromRoomName].genero !== roomsState[toRoom.nome].genero) {
      toast({ title: "Movimento Inválido", description: "Não é possível mover entre blocos de sexo diferente.", variant: "destructive" });
      return;
    }

    setRoomsState(prev => {
      const newRooms = { ...prev };
      newRooms[fromRoomName].ocupantes = newRooms[fromRoomName].ocupantes.filter(p => p.id !== participant.id);
      newRooms[toRoom.nome].ocupantes.push(participant);
      return newRooms;
    });
  };

  const handleGeneratePdf = () => {
    const elementsToPrint = Object.values(roomRefs.current).filter(Boolean) as HTMLElement[];
    if (elementsToPrint.length > 0) {
        generatePdfFromElements(elementsToPrint, 'relatorio-dormitorios.pdf');
    } else {
      toast({ title: "Nenhum quarto para imprimir.", variant: "destructive" });
    }
  };

  const mulheresAlocadas = Object.values(roomsState).filter(r => r.genero === 'feminino');
  const homensAlocados = Object.values(roomsState).filter(r => r.genero === 'masculino');

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
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {mulheresAlocadas.map(quarto => (
                    <DormitoryCard key={`mulheres-${quarto.nome}`} ref={el => (roomRefs.current[quarto.nome] = el)} quarto={quarto} borderColorClass="border-pink-300" />
                  ))}
                </div>
              </div>
            )}
            {homensAlocados.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2">Bloco Masculino</h3>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {homensAlocados.map(quarto => (
                    <DormitoryCard key={`homens-${quarto.nome}`} ref={el => (roomRefs.current[quarto.nome] = el)} quarto={quarto} borderColorClass="border-blue-300" />
                  ))}
                </div>
              </div>
            )}
            {unallocated.length > 0 && (
               <Card className="mt-6 border-orange-500 bg-orange-50">
                  <CardHeader><CardTitle className="text-orange-700 flex items-center gap-2"><AlertTriangle /> Participantes Não Alocados ({unallocated.length})</CardTitle></CardHeader>
                  <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                      {unallocated.map(p => <p key={p.id} className='font-semibold'>{p.nome_completo}</p>)}
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