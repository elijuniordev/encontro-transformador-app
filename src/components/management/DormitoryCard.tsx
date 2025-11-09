// src/components/management/DormitoryCard.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Room } from '@/config/rooms';
import { DraggableParticipant } from './DraggableParticipant';

interface DormitoryCardProps {
  quarto: Room;
  borderColorClass: string;
  isReadOnly: boolean; // NOVO
}

const DormitoryCard = React.forwardRef<HTMLDivElement, DormitoryCardProps>(
  ({ quarto, borderColorClass, isReadOnly }, ref) => { // ADICIONADO isReadOnly
    const { isOver, setNodeRef } = useDroppable({
      id: `droppable-${quarto.nome}`,
      data: { room: quarto },
      disabled: isReadOnly, // DESABILITA O DROP SE FOR READ-ONLY
    });

    const style = {
      backgroundColor: isOver && !isReadOnly ? '#e0f7fa' : undefined, // Feedback visual apenas se não for read-only
    };

    return (
      <div ref={ref} className="break-inside-avoid">
        <Card 
            ref={setNodeRef} 
            style={style} 
            className="flex flex-col transition-colors h-full"
            data-is-readonly={isReadOnly} // Para CSS futuro se necessário
        >
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
                <DraggableParticipant
                  key={p.id}
                  participant={p}
                  roomName={quarto.nome}
                  borderColorClass={borderColorClass}
                  isReadOnly={isReadOnly} // NOVO: Passar a prop
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }
);
DormitoryCard.displayName = 'DormitoryCard';

export default DormitoryCard;