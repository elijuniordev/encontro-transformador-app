// src/components/management/DormitoryCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Participant, Room } from '@/types/dormitory'; // Importa os tipos centralizados

interface DormitoryCardProps {
  quarto: Room;
  borderColorClass: string;
}

const DormitoryCard: React.FC<DormitoryCardProps> = ({ quarto, borderColorClass }) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>{quarto.nome}</span>
        <Badge variant="secondary">{quarto.ocupantes.length} / {quarto.capacidade}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul>
        {quarto.ocupantes.map((p: Participant) => ( // Garante a tipagem aqui
          <li key={p.id} className={`text-sm mb-2 p-2 rounded bg-gray-50 border-l-4 ${borderColorClass}`}>
            <p className="font-semibold flex items-center gap-2"><User className="h-4 w-4" />{p.nome_completo}</p>
            <p className="text-xs text-muted-foreground pl-6">Líder: {p.lider || 'N/A'}</p>
            <p className="text-xs text-muted-foreground pl-6">Discipulado: {p.discipuladores}</p>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default DormitoryCard;