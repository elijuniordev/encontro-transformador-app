// src/components/management/DraggableParticipant.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { User } from 'lucide-react';
import { Inscription as Participant } from '@/types/supabase';

interface DraggableParticipantProps {
  participant: Participant;
  roomName: string;
  borderColorClass: string;
}

export function DraggableParticipant({ participant, roomName, borderColorClass }: DraggableParticipantProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `participant-${participant.id}`,
    data: { participant, fromRoom: roomName }, // Passa dados extras
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`text-sm mb-2 p-2 rounded bg-white border-l-4 touch-none ${borderColorClass} shadow-sm`}
    >
      <p className="font-semibold flex items-center gap-2">
        <User className="h-4 w-4" />
        {participant.nome_completo}
      </p>
      <p className="text-xs text-muted-foreground pl-6">Líder: {participant.lider || 'N/A'}</p>
      <p className="text-xs text-muted-foreground pl-6">Discipulado: {participant.discipuladores}</p>
    </li>
  );
}