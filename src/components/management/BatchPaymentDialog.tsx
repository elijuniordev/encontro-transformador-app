// src/components/management/BatchPaymentDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Inscription } from "@/types/supabase";
import { FORMA_PAGAMENTO_OPTIONS } from "@/config/options";
import { Loader2 } from "lucide-react";

interface BatchPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inscriptions: Inscription[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  amount: string;
  setAmount: (value: string) => void;
  method: string;
  setMethod: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const BatchPaymentDialog = ({
  isOpen, onClose, inscriptions, selectedIds, onSelectionChange, onSelectAll, onClearAll,
  amount, setAmount, method, setMethod, onSubmit, isLoading
}: BatchPaymentDialogProps) => {

  const isAllSelected = inscriptions.length > 0 && selectedIds.size === inscriptions.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Lançamento de Pagamentos em Lote</DialogTitle>
          <DialogDescription>
            Selecione os inscritos e insira as informações de pagamento para registrar em massa.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div>
            <Label htmlFor="batch-amount">Valor (R$)</Label>
            <Input id="batch-amount" type="text" inputMode="decimal" placeholder="100,00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="batch-method">Forma de Pagamento</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id="batch-method"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{FORMA_PAGAMENTO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md">
          <div className="p-2 border-b flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onSelectAll}>Selecionar Todos</Button>
            <Button variant="outline" size="sm" onClick={onClearAll}>Limpar Seleção</Button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
                  </TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscriptions.map(inscription => (
                  <TableRow key={inscription.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(inscription.id)}
                        onCheckedChange={() => onSelectionChange(inscription.id)}
                      />
                    </TableCell>
                    <TableCell>{inscription.nome_completo}</TableCell>
                    <TableCell>{inscription.status_pagamento}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrar {selectedIds.size} Pagamento(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};