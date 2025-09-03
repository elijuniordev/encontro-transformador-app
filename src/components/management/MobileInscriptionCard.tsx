// src/components/management/MobileInscriptionCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Inscription } from "@/types/supabase";
import { MobileCardActions } from "./mobile/MobileCardActions";
import { MobileCardViewMode } from "./mobile/MobileCardViewMode";
import { MobileCardEditMode } from "./mobile/MobileCardEditMode";

interface MobileInscriptionCardProps {
  inscription: Inscription;
  getStatusBadge: (status: string) => JSX.Element;
  handleDelete: (id: string) => void;
  onOpenPaymentModal: () => void;
  isEditing: boolean;
  editData: Partial<Inscription>;
  setEditData: (data: Partial<Inscription>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  setEditingId: (id: string | null) => void;
}

export const MobileInscriptionCard = ({
  inscription,
  getStatusBadge,
  handleDelete,
  onOpenPaymentModal,
  isEditing,
  editData,
  setEditData,
  onEdit,
  onSave,
  onCancel,
  setEditingId
}: MobileInscriptionCardProps) => {

  return (
    <Card className="shadow-sm border mb-4">
      <CardContent className="p-4 space-y-2 text-sm">
        {isEditing ? (
          <MobileCardEditMode
            inscription={inscription}
            editData={editData}
            setEditData={setEditData}
            handleSaveEdit={onSave}
            setEditingId={setEditingId}
            handleDelete={handleDelete}
          />
        ) : (
          <>
            <MobileCardViewMode inscription={inscription} getStatusBadge={getStatusBadge} />
            <MobileCardActions
              inscription={inscription}
              isEditing={isEditing}
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onDelete={handleDelete}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};