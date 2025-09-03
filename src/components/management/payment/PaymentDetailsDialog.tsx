// src/components/payment/PaymentDetailsDialog.tsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Inscription, Payment } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Info, AlertCircle } from "lucide-react";
import { FORMA_PAGAMENTO_OPTIONS } from "@/config/options";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { paymentSchema } from "@/lib/validations/paymentSchema";
import { ZodError } from "zod";

interface PaymentDetailsDialogProps {
  inscription: Inscription | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentUpdate: () => void;
}

export const PaymentDetailsDialog = ({ inscription, isOpen, onClose, onPaymentUpdate }: PaymentDetailsDialogProps) => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!inscription) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('inscription_id', inscription.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar pagamentos:", error);
      toast({ title: "Erro ao buscar pagamentos", description: error.message, variant: "destructive" });
    } else {
      setPayments(data || []);
    }
    setIsLoading(false);
  }, [inscription, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchPayments();
      setError(null);
      setNewAmount('');
      setNewMethod('');
    }
  }, [isOpen, fetchPayments]);

  const handleAddPayment = async (e: React.FormEvent) => {
    // A LINHA MAIS IMPORTANTE: Impede que o navegador recarregue a página.
    e.preventDefault();

    setError(null);

    try {
      paymentSchema.parse({ newAmount, newMethod });
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    const sanitizedAmount = newAmount.replace(',', '.');
    const parsedAmount = parseFloat(sanitizedAmount);

    if(parsedAmount > 10000){
        setError("O valor do pagamento parece muito alto. Verifique o valor inserido.")
        return;
    }

    setIsLoading(true);
    const { error: insertError } = await supabase.from('payments').insert({
      inscription_id: inscription!.id,
      amount: parsedAmount,
      payment_method: newMethod
    });
    setIsLoading(false);

    if (insertError) {
      setError(`Erro do banco de dados: ${insertError.message}`);
      toast({ title: "Erro ao adicionar pagamento", description: "Verifique os detalhes do erro acima do formulário.", variant: "destructive" });
    } else {
      toast({ title: "Pagamento adicionado com sucesso!" });
      onPaymentUpdate();
      onClose();
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    setIsLoading(true);
    const { error: deleteError } = await supabase.from('payments').delete().eq('id', paymentId);
    setIsLoading(false);

    if(deleteError){
      setError(`Erro ao deletar: ${deleteError.message}`);
      toast({ title: "Erro ao deletar pagamento", variant: "destructive" });
    } else {
      toast({ title: "Pagamento deletado com sucesso!" });
      onPaymentUpdate();
      onClose();
    }
  }

  const saldoDevedor = inscription ? inscription.total_value - inscription.paid_amount : 0;
  const isWaived = inscription?.status_pagamento === 'Isento';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerenciar Pagamentos</DialogTitle>
          <DialogDescription>Para: {inscription?.nome_completo}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-2 text-center my-4">
            <div><p className="text-sm text-muted-foreground">Valor Total</p><p className="font-bold">R$ {inscription?.total_value.toFixed(2).replace('.', ',')}</p></div>
            <div><p className="text-sm text-muted-foreground">Valor Pago</p><p className="font-bold text-green-600">R$ {inscription?.paid_amount.toFixed(2).replace('.', ',')}</p></div>
            <div><p className="text-sm text-muted-foreground">Saldo Devedor</p><p className="font-bold text-red-600">R$ {saldoDevedor.toFixed(2).replace('.', ',')}</p></div>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro de Validação</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {isWaived ? (
          <div className="border-t pt-4 text-center text-muted-foreground flex items-center justify-center gap-2 bg-slate-50 p-4 rounded-md">
            <Info className="h-5 w-5"/>
            <p className="font-semibold">Este participante é isento de pagamento.</p>
          </div>
        ) : (
          <form onSubmit={handleAddPayment} className="space-y-4 border-t pt-4">
            <h4 className="font-semibold">Adicionar Novo Pagamento</h4>
            <div className="flex gap-2 items-end">
              <div className="flex-grow">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input id="amount" type="text" inputMode="decimal" placeholder="100,00" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="method">Forma</Label>
                <Select value={newMethod} onValueChange={setNewMethod}>
                  <SelectTrigger id="method" className="w-[120px]"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{FORMA_PAGAMENTO_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar"}</Button>
            </div>
          </form>
        )}

        <div className="space-y-2 border-t pt-4">
          <h4 className="font-semibold">Histórico de Pagamentos</h4>
          {isLoading && !payments.length && <p>Carregando histórico...</p>}
          {payments.length === 0 && !isLoading && <p className="text-sm text-muted-foreground">Nenhum pagamento registrado.</p>}
          <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
            {payments.map(p => (
              <div key={p.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                <div>
                  <span className="font-semibold">R$ {p.amount.toFixed(2).replace('.', ',')}</span>
                  <span className="text-muted-foreground"> via {p.payment_method}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString('pt-BR')}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeletePayment(p.id)} disabled={isLoading}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};