// src/components/management/DesktopInscriptionRow.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Removido o TooltipProvider daqui
import { Eye, Edit, Trash2 } from "lucide-react";
import { Inscription } from "@/types/supabase";
import { FORMA_PAGAMENTO_OPTIONS, STATUS_PAGAMENTO_OPTIONS } from "@/config/options";

// ... (Interface e componente DeleteButtonWithDialog permanecem os mesmos)
interface DesktopInscriptionRowProps {
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
             <Button size="sm" variant="destructive" className="px-2 py-1">
                <Trash2 className="h-4 w-4" />
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


export const DesktopInscriptionRow = ({
  inscription,
  getStatusBadge,
  editingId,
  editData,
  handleEdit,
  handleSaveEdit,
  setEditingId,
  setEditData,
  handleDelete
}: DesktopInscriptionRowProps) => (
  <TableRow key={inscription.id} className={editingId === inscription.id ? "bg-accent" : ""}>
    {/* ... Células da tabela ... */}
    <TableCell className="font-medium text-sm">{inscription.nome_completo}</TableCell>
    <TableCell className="text-sm">{inscription.discipuladores}</TableCell>
    <TableCell className="text-sm">{inscription.lider}</TableCell>
    <TableCell className="text-sm">{inscription.anjo_guarda || "-"}</TableCell>
    <TableCell className="text-sm">{inscription.whatsapp}</TableCell>
    <TableCell className="text-sm">{inscription.irmao_voce_e}</TableCell>
    <TableCell>
      {editingId === inscription.id ? (
        <Select
          value={editData.status_pagamento || ''}
          onValueChange={(value) => {
            const newData: Partial<Inscription> = { ...editData, status_pagamento: value };
            if (['Pendente', 'Cancelado', 'Isento'].includes(value)) {
              newData.forma_pagamento = null;
            }
            setEditData(newData);
          }}
        >
          <SelectTrigger className="w-[110px] text-xs sm:text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>{STATUS_PAGAMENTO_OPTIONS.map(option => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
        </Select>
      ) : ( getStatusBadge(inscription.status_pagamento) )}
    </TableCell>
    <TableCell>
      {editingId === inscription.id ? (
        <Select
          value={editData.forma_pagamento || ''}
          onValueChange={(value) => setEditData({...editData, forma_pagamento: value})}
          disabled={['Pendente', 'Cancelado', 'Isento'].includes(editData.status_pagamento || '')}
        >
          <SelectTrigger className="w-[100px] text-xs sm:text-sm"><SelectValue placeholder="N/A" /></SelectTrigger>
          <SelectContent>{FORMA_PAGAMENTO_OPTIONS.map(option => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
        </Select>
      ) : ( inscription.forma_pagamento || "-" )}
    </TableCell>
    <TableCell>
      {editingId === inscription.id ? (
        <Input type="number" value={editData.valor !== undefined ? String(editData.valor) : ''} onChange={(e) => setEditData({...editData, valor: Number(e.target.value)})} className="w-20 text-xs sm:text-sm"/>
      ) : ( `R$ ${inscription.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` )}
    </TableCell>
    
    {/* <<< INÍCIO DA CORREÇÃO >>> */}
    <TableCell>
      {inscription.irmao_voce_e === "Encontrista" ? (
        <Dialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="px-2 py-1">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ver Contatos</p>
            </TooltipContent>
          </Tooltip>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Contatos Responsáveis</DialogTitle>
              <DialogDescription>Detalhes dos responsáveis por {inscription.nome_completo}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {inscription.responsavel_1_nome && (
                <div className="space-y-1">
                  <h4 className="text-md font-semibold">Responsável 1</h4>
                  <p>Nome: {inscription.responsavel_1_nome}</p>
                  <p>WhatsApp: {inscription.responsavel_1_whatsapp}</p>
                </div>
              )}
              {inscription.responsavel_2_nome && (
                <div className="space-y-1">
                  <h4 className="text-md font-semibold">Responsável 2</h4>
                  <p>Nome: {inscription.responsavel_2_nome}</p>
                  <p>WhatsApp: {inscription.responsavel_2_whatsapp}</p>
                </div>
              )}
              {inscription.responsavel_3_nome && (
                <div className="space-y-1">
                  <h4 className="text-md font-semibold">Responsável 3</h4>
                  <p>Nome: {inscription.responsavel_3_nome}</p>
                  <p>WhatsApp: {inscription.responsavel_3_whatsapp}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : "-"}
    </TableCell>
    {/* <<< FIM DA CORREÇÃO >>> */}

    <TableCell>
      {editingId === inscription.id ? (
        <Input value={editData.observacao || ''} onChange={(e) => setEditData({...editData, observacao: e.target.value})} className="w-32 text-xs sm:text-sm" placeholder="Observação..."/>
      ) : ( inscription.observacao || "-" )}
    </TableCell>
    <TableCell>
      {editingId === inscription.id ? (
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSaveEdit} className="text-xs px-2 py-1">Salvar</Button>
          <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-xs px-2 py-1">Cancelar</Button>
        </div>
      ) : (
        <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => handleEdit(inscription)} className="px-2 py-1">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Editar</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DeleteButtonWithDialog id={inscription.id} name={inscription.nome_completo} handleDelete={handleDelete} />
                </div>
              </TooltipTrigger>
              <TooltipContent><p>Deletar</p></TooltipContent>
            </Tooltip>
        </div>
      )}
    </TableCell>
  </TableRow>
);