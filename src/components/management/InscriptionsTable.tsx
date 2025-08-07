// src/components/management/InscriptionsTable.tsx
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Users, ChevronRight, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Inscription {
  id: string;
  discipuladores: string;
  lider: string;
  nome_completo: string;
  anjo_guarda: string;
  sexo: string;
  idade: string;
  whatsapp: string;
  irmao_voce_e: string;
  responsavel_1_nome: string | null;
  responsavel_1_whatsapp: string | null;
  responsavel_2_nome: string | null;
  responsavel_2_whatsapp: string | null;
  responsavel_3_nome: string | null;
  responsavel_3_whatsapp: string | null;
  status_pagamento: string;
  forma_pagamento: string | null;
  valor: number;
  observacao: string | null;
  created_at: string;
}

interface InscriptionsTableProps {
  filteredInscriptions: Inscription[];
  isMobile: boolean;
  userRole: string | null;
  userDiscipulado: string | null;
  getStatusBadge: (status: string) => JSX.Element;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  // CORRIGIDO AQUI: Adicionado editData e setEditData com o tipo correto
  editData: Partial<Inscription>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<Inscription>>>;
  handleEdit: (inscription: Inscription) => void;
  handleSaveEdit: () => void;
  handleDelete: (id: string) => void;
}

const InscriptionsTable = ({
  filteredInscriptions,
  isMobile,
  userRole,
  userDiscipulado,
  getStatusBadge,
  editingId,
  setEditingId,
  editData,
  setEditData,
  handleEdit,
  handleSaveEdit,
  handleDelete,
}: InscriptionsTableProps) => {

  // Componente para exibir uma inscrição em formato de cartão no mobile
  const MobileInscriptionCard = ({ inscription }: { inscription: Inscription }) => (
    <Card className="shadow-sm border mb-4">
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <p className="font-bold text-primary flex-grow min-w-0">Nome: <span className="font-normal text-foreground truncate">{inscription.nome_completo}</span></p>
          <Badge variant={getStatusBadge(inscription.status_pagamento).props.variant} className="ml-auto">{inscription.status_pagamento}</Badge>
        </div>
        <p><strong className="text-primary">Função:</strong> {inscription.irmao_voce_e}</p>
        <p><strong className="text-primary">Anjo da Guarda:</strong> {inscription.anjo_guarda || "-"}</p>
        <p><strong className="text-primary">Discipulador:</strong> {inscription.discipuladores}</p>
        <p><strong className="text-primary">Líder:</strong> {inscription.lider}</p>
        <p><strong className="text-primary">WhatsApp:</strong> {inscription.whatsapp}</p>
        <p><strong className="text-primary">Valor:</strong> R$ {inscription.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong className="text-primary">Forma Pagamento:</strong> {inscription.forma_pagamento || "-"}</p>
        {inscription.irmao_voce_e === "Encontrista" && (
          <>
            <p><strong className="text-primary">Responsável 1:</strong> {inscription.responsavel_1_nome || "-"}</p>
            <p><strong className="text-primary">WhatsApp Resp. 1:</strong> {inscription.responsavel_1_whatsapp || "-"}</p>
          </>
        )}
        <p><strong className="text-primary">Observação:</strong> {inscription.observacao || "-"}</p>

        {/* Botão de Edição para Mobile */}
        <div className="flex flex-col gap-2 mt-3">
          {editingId === inscription.id ? (
            <div className="flex flex-col gap-2 w-full">
              <Select
                value={editData.status_pagamento || ''}
                onValueChange={(value) => {
                  setEditData({ ...editData, status_pagamento: value });
                  // Lógica para ajustar a forma_pagamento automaticamente
                  if (['Pendente', 'Cancelado', 'Isento'].includes(value)) {
                    setEditData(prev => ({ ...prev, status_pagamento: value, forma_pagamento: value })); // Garante que status_pagamento seja atualizado
                  } else if (editData.forma_pagamento === value) {
                    // Se mudar de Pendente/Cancelado/Isento para Confirmado, limpa a forma de pagamento
                    setEditData(prev => ({ ...prev, status_pagamento: value, forma_pagamento: null }));
                  }
                }}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Status Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                  <SelectItem value="Isento">Isento</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editData.forma_pagamento || ''}
                onValueChange={(value) => setEditData({...editData, forma_pagamento: value})}
                // Desabilitar se status_pagamento for Pendente, Cancelado ou Isento
                disabled={['Pendente', 'Cancelado', 'Isento'].includes(editData.status_pagamento || '')}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Forma Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="CartaoCredito2x">Cartão de Crédito 2x</SelectItem>
                  <SelectItem value="CartaoDebito">Cartão de Débito</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  {/* Adiciona as opções de status como itens selecionáveis quando desabilitado, mas que não podem ser escolhidos */}
                  {['Pendente', 'Cancelado', 'Isento'].map(statusVal => (
                    <SelectItem key={statusVal} value={statusVal} disabled>{statusVal}</SelectItem>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" className="w-1/2">
                    <Trash2 className="h-4 w-4 mr-2" /> Deletar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente a inscrição de {inscription.nome_completo}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(inscription.id)}>
                      Sim, excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-divine">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Inscrições
          {userRole === "discipulador" && (
            <Badge variant="secondary" className="ml-2">
              Filtrado: {userDiscipulado}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="space-y-4">
            {filteredInscriptions.length === 0 ? (
              <Card className="shadow-sm border">
                <CardContent className="p-4 text-center text-muted-foreground">
                  Nenhuma inscrição encontrada.
                </CardContent>
              </Card>
            ) : (
              filteredInscriptions.map((inscription) => (
                <MobileInscriptionCard key={inscription.id} inscription={inscription} />
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Discipuladores</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead>Anjo da Guarda</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status Pagamento</TableHead>
                  <TableHead>Forma Pagamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Responsáveis</TableHead> {/* Coluna unificada */}
                  <TableHead>Observação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInscriptions.map((inscription) => (
                  <TableRow key={inscription.id}>
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
                            setEditData({ ...editData, status_pagamento: value });
                            // Lógica para ajustar a forma_pagamento automaticamente
                            if (['Pendente', 'Cancelado', 'Isento'].includes(value)) {
                              setEditData(prev => ({ ...prev, status_pagamento: value, forma_pagamento: value }));
                            } else if (value === 'Confirmado' && ['Pendente', 'Cancelado', 'Isento'].includes(editData.forma_pagamento || '')) {
                                setEditData(prev => ({ ...prev, status_pagamento: value, forma_pagamento: null }));
                            } else if (value === 'Confirmado') {
                                setEditData(prev => ({ ...prev, status_pagamento: value, forma_pagamento: null }));
                            }
                          }}
                        >
                          <SelectTrigger className="w-[110px] text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Confirmado">Confirmado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                            <SelectItem value="Isento">Isento</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(inscription.status_pagamento)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === inscription.id ? (
                        <Select
                          value={editData.forma_pagamento || ''}
                          onValueChange={(value) => setEditData({...editData, forma_pagamento: value})}
                          // Desabilitar se status_pagamento for Pendente, Cancelado ou Isento
                          disabled={['Pendente', 'Cancelado', 'Isento'].includes(editData.status_pagamento || '')}
                        >
                          <SelectTrigger className="w-[100px] text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pix">Pix</SelectItem>
                            <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                            <SelectItem value="CartaoCredito2x">Cartão de Crédito 2x</SelectItem>
                            <SelectItem value="CartaoDebito">Cartão de Débito</SelectItem>
                            <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        inscription.forma_pagamento || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === inscription.id ? (
                        <Input
                          type="number"
                          value={editData.valor !== undefined ? String(editData.valor) : ''}
                          onChange={(e) => setEditData({...editData, valor: Number(e.target.value)})}
                          className="w-16 text-xs sm:text-sm"
                        />
                      ) : (
                        `R$ ${inscription.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </TableCell>
                    <TableCell>
                      {inscription.irmao_voce_e === "Encontrista" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="px-2 py-1">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Contatos
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Contatos Responsáveis</DialogTitle>
                              <DialogDescription>
                                Detalhes dos responsáveis por {inscription.nome_completo}.
                              </DialogDescription>
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
                      )}
                      {inscription.irmao_voce_e !== "Encontrista" && "-"}
                    </TableCell>
                    <TableCell>
                      {editingId === inscription.id ? (
                        <Input
                          value={editData.observacao || ''}
                          onChange={(e) => setEditData({...editData, observacao: e.target.value})}
                          className="w-32 text-xs sm:text-sm"
                          placeholder="Observação..."
                        />
                      ) : (
                        inscription.observacao || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === inscription.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={handleSaveEdit} className="text-xs px-2 py-1">
                            Salvar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-xs px-2 py-1">
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(inscription)} className="px-2 py-1">
                            <Edit className="h-4 w-4" />
                          </Button>
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
                                  Esta ação não pode ser desfeita. Isso excluirá permanentemente a inscrição de {inscription.nome_completo}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(inscription.id)}>
                                  Sim, excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InscriptionsTable;