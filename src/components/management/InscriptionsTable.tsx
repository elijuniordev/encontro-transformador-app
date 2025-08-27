// src/components/management/InscriptionsTable.tsx
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Inscription } from "@/types/supabase";
import { MobileInscriptionCard } from "./MobileInscriptionCard";
import { DesktopInscriptionRow } from "./DesktopInscriptionRow";

interface InscriptionsTableProps {
  filteredInscriptions: Inscription[];
  userRole: string | null;
  userDiscipulado: string | null;
  getStatusBadge: (status: string) => JSX.Element;
  handleDelete: (id: string) => void;
  fetchInscriptions: () => void;
}

const InscriptionsTable = ({
  filteredInscriptions,
  userRole,
  userDiscipulado,
  getStatusBadge,
  handleDelete,
  fetchInscriptions
}: InscriptionsTableProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inscription>>({});

  const handleEdit = useCallback((inscription: Inscription) => {
    setEditingId(inscription.id);
    setEditData({
      status_pagamento: inscription.status_pagamento,
      forma_pagamento: inscription.forma_pagamento,
      valor: inscription.valor,
      observacao: inscription.observacao
    });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from('inscriptions')
      .update(editData)
      .eq('id', editingId);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a inscrição.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Dados atualizados",
        description: "As informações foram salvas com sucesso.",
      });
      fetchInscriptions();
    }
    setEditingId(null);
  }, [editingId, editData, fetchInscriptions, toast]);

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
              <Card className="shadow-sm border"><CardContent className="p-4 text-center text-muted-foreground">Nenhuma inscrição encontrada.</CardContent></Card>
            ) : (
              filteredInscriptions.map((inscription) => (
                <MobileInscriptionCard
                  key={inscription.id}
                  inscription={inscription}
                  getStatusBadge={getStatusBadge}
                  editingId={editingId}
                  editData={editData}
                  handleEdit={handleEdit}
                  handleSaveEdit={handleSaveEdit}
                  setEditingId={setEditingId}
                  setEditData={setEditData}
                  handleDelete={handleDelete}
                />
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
                  <TableHead>Responsáveis</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInscriptions.map((inscription) => (
                  <DesktopInscriptionRow
                    key={inscription.id}
                    inscription={inscription}
                    getStatusBadge={getStatusBadge}
                    editingId={editingId}
                    editData={editData}
                    handleEdit={handleEdit}
                    handleSaveEdit={handleSaveEdit}
                    setEditingId={setEditingId}
                    setEditData={setEditData}
                    handleDelete={handleDelete}
                  />
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