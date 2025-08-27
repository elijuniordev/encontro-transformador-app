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
}

const DormitoryCard: React.FC<DormitoryCardProps> = ({ quarto, borderColorClass }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${quarto.nome}`,
    data: { room: quarto }, // Passa o quarto como dado
  });

  const style = {
    backgroundColor: isOver ? '#e0f7fa' : undefined, // Feedback visual ao arrastar sobre
  };

  return (
    <Card ref={setNodeRef} style={style} className="flex flex-col transition-colors">
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
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DormitoryCard;