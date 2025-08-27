// src/components/management/MobileInscriptionCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { Inscription } from "@/types/supabase";
import { FORMA_PAGAMENTO_OPTIONS, STATUS_PAGAMENTO_OPTIONS } from "@/config/options";

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

const DeleteButtonWithDialog = ({ id, name, handleDelete }: { id: string, name: string, handleDelete: (id: string) => void }) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" className="w-full md:w-auto">
                <Trash2 className="h-4 w-4 mr-2" /> Deletar
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a inscrição de {name}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(id)}>
                    Sim, excluir
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);


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
}: MobileInscriptionCardProps) => (
    <Card className="shadow-sm border mb-4">
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <p className="font-bold text-primary flex-grow min-w-0">Nome: <span className="font-normal text-foreground truncate">{inscription.nome_completo}</span></p>
          {getStatusBadge(inscription.status_pagamento)}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <p><strong className="text-primary">Função:</strong> {inscription.irmao_voce_e}</p>
          <p><strong className="text-primary">Anjo da Guarda:</strong> {inscription.anjo_guarda || "-"}</p>
          <p><strong className="text-primary">Discipulador:</strong> {inscription.discipuladores}</p>
          <p><strong className="text-primary">Líder:</strong> {inscription.lider}</p>
          <p><strong className="text-primary">WhatsApp:</strong> {inscription.whatsapp}</p>
          <p><strong className="text-primary">Valor:</strong> R$ {inscription.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong className="text-primary">Forma Pagamento:</strong> {inscription.forma_pagamento || "-"}</p>
          <p><strong className="text-primary">Observação:</strong> {inscription.observacao || "-"}</p>
        </div>


        {inscription.irmao_voce_e === "Encontrista" && (
          <div className="mt-4 border-t pt-2">
            <p className="text-primary font-semibold mb-2">Contatos de Responsáveis:</p>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {inscription.responsavel_1_nome && (
                <>
                  <p><strong className="text-primary">Resp. 1:</strong> {inscription.responsavel_1_nome} ({inscription.responsavel_1_whatsapp})</p>
                </>
              )}
              {inscription.responsavel_2_nome && (
                <p><strong className="text-primary">Resp. 2:</strong> {inscription.responsavel_2_nome} ({inscription.responsavel_2_whatsapp})</p>
              )}
              {inscription.responsavel_3_nome && (
                <p><strong className="text-primary">Resp. 3:</strong> {inscription.responsavel_3_nome} ({inscription.responsavel_3_whatsapp})</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-3">
          {editingId === inscription.id ? (
            <div className="flex flex-col gap-2 w-full">
              <Select
                value={editData.status_pagamento || ''}
                onValueChange={(value) => setEditData({ ...editData, status_pagamento: value })}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Status Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_PAGAMENTO_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={editData.forma_pagamento || ''}
                onValueChange={(value) => setEditData({...editData, forma_pagamento: value})}
                disabled={['Pendente', 'Cancelado', 'Isento'].includes(editData.status_pagamento || '')}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Forma Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {FORMA_PAGAMENTO_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={editData.valor !== undefined ? String(editData.valor) : ''}
                onChange={(e) => setEditData({...editData, valor: Number(e.target.value)})}
                className="w-full text-sm"
                placeholder="Valor"
              />
              <Input
                value={editData.observacao || ''}
                onChange={(e) => setEditData({...editData, observacao: e.target.value})}
                className="w-full text-sm"
                placeholder="Observação..."
              />
              <div className="flex gap-2 justify-end w-full">
                <Button size="sm" onClick={handleSaveEdit} className="text-sm">Salvar</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-sm">Cancelar</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-2 w-full mt-3">
              <Button size="sm" variant="outline" onClick={() => handleEdit(inscription)} className="w-1/2">
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
              <DeleteButtonWithDialog id={inscription.id} name={inscription.nome_completo} handleDelete={handleDelete} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
);