// src/components/management/MobileInscriptionCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Inscription } from "@/types/supabase";
import { MobileCardViewMode } from "./mobile/MobileCardViewMode";
import { MobileCardEditMode } from "./mobile/MobileCardEditMode";
import { MobileCardActions } from "./mobile/MobileCardActions";

interface MobileInscriptionCardProps {
  inscription: Inscription;
  getStatusBadge: (status: string) => JSX.Element;
  editingId: string | null;
  editData: Partial<Inscription>;
  handleEdit: (inscription: Inscription) => void;
  handleSaveEdit: () => void;
  setEditingId: (id: string | null) => void;
  setEditData: (data: Partial<Inscription>) => void;
  handleDelete: (id: string) => void;
}

export const MobileInscriptionCard = ({
  inscription,
  getStatusBadge,
  editingId,
  editData,
  handleEdit,
  handleSaveEdit,
  setEditingId,
  setEditData,
  handleDelete
}: MobileInscriptionCardProps) => {
  const isEditing = editingId === inscription.id;

  return (
    <Card className="shadow-sm border mb-4">
      <CardContent className="p-4 space-y-2 text-sm">
        {isEditing ? (
          <MobileCardEditMode
            inscription={inscription}
            editData={editData}
            setEditData={setEditData}
            handleSaveEdit={handleSaveEdit}
            setEditingId={setEditingId}
            handleDelete={handleDelete}
          />
        ) : (
          <>
            <MobileCardViewMode
              inscription={inscription}
              getStatusBadge={getStatusBadge}
            />
            <MobileCardActions
              inscription={inscription}
              isEditing={isEditing}
              onEdit={() => handleEdit(inscription)}
              onSave={handleSaveEdit}
              onCancel={() => setEditingId(null)}
              onDelete={handleDelete}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};