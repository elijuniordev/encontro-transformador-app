import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, LogOut, Eye, Edit, Users, Settings, DollarSign, Download, AlertTriangle, Briefcase, Utensils, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
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
import { useIsMobile } from "@/hooks/use-mobile"; // Importar o hook de mobile

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

const Management = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile(); // Usar o hook de mobile
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipulado, setFilterDiscipulado] = useState(false);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inscription>>({});
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const userDiscipulado = localStorage.getItem("userDiscipulado");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  console.log('Management Page - User Role:', userRole, 'Is Authenticated:', isAuthenticated);
  console.log('Management Page - isRegistrationsOpen state:', isRegistrationsOpen);


  const fetchInscriptions = useCallback(async () => {
    const { data, error } = await supabase
      .from('inscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar inscrições:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as inscrições do banco de dados.",
        variant: "destructive"
      });
    } else {
      setInscriptions(data as Inscription[]);
    }
  }, [toast]);

  const fetchRegistrationStatus = useCallback(async () => {
    const { data, error } = await supabase
      .from('event_settings')
      .select('registrations_open, id')
      .single();

    if (error) {
      console.error("Erro ao buscar status das inscrições:", error);
      setIsRegistrationsOpen(true); 
    } else {
      setIsRegistrationsOpen(data.registrations_open);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchInscriptions();
    fetchRegistrationStatus();
  }, [isAuthenticated, navigate, fetchInscriptions, fetchRegistrationStatus]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userDiscipulado");
    navigate("/");
  };

  const handleToggleRegistrations = async () => {
    const newStatus = !isRegistrationsOpen;
    setIsRegistrationsOpen(newStatus);

    const settingsId = '8ff1cff8-2c26-4cc4-b2bf-7faa5612b747'; // <<< ID REAL DA SUA TABELA event_settings

    const { error } = await supabase
      .from('event_settings')
      .update({ registrations_open: newStatus })
      .eq('id', settingsId); 

    if (error) {
      console.error("Erro ao atualizar status das inscrições:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível alterar o status das inscrições. Verifique as permissões e o ID.",
        variant: "destructive"
      });
      setIsRegistrationsOpen(!newStatus);
    } else {
      toast({
        title: "Status Atualizado",
        description: `Inscrições ${newStatus ? "abertas" : "encerradas"} com sucesso!`,
      });
    }
  };

  const filteredInscriptions = inscriptions.filter(inscription => {
    const matchesSearch = inscription.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inscription.whatsapp.includes(searchTerm) ||
                         inscription.discipuladores.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDiscipulado = !filterDiscipulado || 
                              (userDiscipulado && inscription.discipuladores === userDiscipulado);

    return matchesSearch && matchesDiscipulado;
  });

  const situationCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      Encontrista: 0,
      Equipe: 0,
      Cozinha: 0,
    };
    filteredInscriptions.forEach(inscription => {
      if (inscription.irmao_voce_e && Object.hasOwn(counts, inscription.irmao_voce_e)) {
        counts[inscription.irmao_voce_e]++;
      } else if (inscription.irmao_voce_e) {
        counts[inscription.irmao_voce_e] = (counts[inscription.irmao_voce_e] || 0) + 1;
      }
    });
    return counts;
  }, [filteredInscriptions]);

  const handleEdit = (inscription: Inscription) => {
    setEditingId(inscription.id);
    setEditData({
      status_pagamento: inscription.status_pagamento,
      forma_pagamento: inscription.forma_pagamento,
      valor: inscription.valor,
      observacao: inscription.observacao
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from('inscriptions')
      .update(editData)
      .eq('id', editingId);

    if (error) {
      console.error("Erro ao salvar edição:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a inscrição no banco de dados.",
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
    setEditData({});
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Confirmado": "default",
      "Pendente": "secondary",
      "Cancelado": "destructive",
      "Isento": "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const handleExportXLSX = () => {
    const dataToExport = filteredInscriptions.map(inscription => ({
      "ID": inscription.id,
      "Nome Completo": inscription.nome_completo,
      "Discipuladores": inscription.discipuladores,
      "Líder": inscription.lider,
      "Anjo da Guarda": inscription.anjo_guarda,
      "Sexo": inscription.sexo,
      "Idade": inscription.idade,
      "WhatsApp": inscription.whatsapp,
      "Função": inscription.irmao_voce_e,
      "Resp. 1 Nome": inscription.responsavel_1_nome,
      "Resp. 1 WhatsApp": inscription.responsavel_1_whatsapp,
      "Resp. 2 Nome": inscription.responsavel_2_nome,
      "Resp. 2 WhatsApp": inscription.responsavel_2_whatsapp,
      "Resp. 3 Nome": inscription.responsavel_3_nome,
      "Resp. 3 WhatsApp": inscription.responsavel_3_whatsapp,
      "Status Pagamento": inscription.status_pagamento,
      "Forma Pagamento": inscription.forma_pagamento,
      "Valor": inscription.valor,
      "Observação": inscription.observacao,
      "Data Inscrição": new Date(inscription.created_at).toLocaleDateString('pt-BR'),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inscrições");
    XLSX.writeFile(wb, "inscricoes_encontro_com_deus.xlsx");

    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados para inscricoes_encontro_com_deus.xlsx",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  // Componente para exibir uma inscrição em formato de cartão no mobile
  const MobileInscriptionCard = ({ inscription }: { inscription: Inscription }) => (
    <Card className="shadow-sm border mb-4">
      <CardContent className="p-4 space-y-2 text-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <p className="font-bold text-primary flex-grow min-w-0">Nome: <span className="font-normal text-foreground truncate">{inscription.nome_completo}</span></p>
          <Badge variant={getStatusBadge(inscription.status_pagamento).props.variant} className="ml-auto">{inscription.status_pagamento}</Badge>
        </div>
        <p><strong className="text-primary">Discipulador:</strong> {inscription.discipuladores}</p>
        <p><strong className="text-primary">Líder:</strong> {inscription.lider}</p>
        <p><strong className="text-primary">WhatsApp:</strong> {inscription.whatsapp}</p>
        <p><strong className="text-primary">Função:</strong> {inscription.irmao_voce_e}</p>
        <p><strong className="text-primary">Valor:</strong> R$ {inscription.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong className="text-primary">Forma Pagamento:</strong> {inscription.forma_pagamento || "-"}</p>
        <p><strong className="text-primary">Observação:</strong> {inscription.observacao || "-"}</p>

        {/* Botão de Edição para Mobile */}
        <div className="flex justify-end mt-3">
          {editingId === inscription.id ? (
            <div className="flex flex-col gap-2 w-full">
              <Select 
                value={editData.status_pagamento || ''}
                onValueChange={(value) => setEditData({...editData, status_pagamento: value})}
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
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Forma Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
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
            <Button size="sm" variant="outline" onClick={() => handleEdit(inscription)} className="w-full">
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      {/* O conteúdo da página está aqui, ocupando o espaço e com padding */}
      {/* Removido max-w-7xl para mobile para permitir que o conteúdo use 100% da largura, e padding horizontal */}
      <div className="mx-auto flex-grow px-4 py-4 w-full md:max-w-7xl sm:px-6"> 
        {/* Header da Página de Gestão */}
        <Card className="shadow-peaceful mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-2">
              <div className="flex-grow min-w-0"> 
                <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
                  {/* Força o título a quebrar linha e não transbordar, usando max-w-full */}
                  <span className="flex-grow min-w-0">Sistema de Gestão - Encontro com Deus</span> {/* Removido truncate e max-w- do span */}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Logado como: <span className="truncate">{userEmail} ({userRole})</span>
                </p>
              </div>

              {/* Botões de Ação do Header - Ajustado para melhor responsividade no topo */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                {userRole === "admin" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant={isRegistrationsOpen ? "destructive" : "default"} 
                        className="flex items-center gap-2 text-sm px-3 py-2 w-full justify-center"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {isRegistrationsOpen ? "Encerrar Inscrições" : "Abrir Inscrições"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {isRegistrationsOpen ? "Tem certeza que deseja ENCERRAR as inscrições?" : "Tem certeza que deseja ABRIR as inscrições?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação irá {isRegistrationsOpen ? "encerrar" : "abrir"} imediatamente as inscrições para o Encontro com Deus. Os usuários verão o status atualizado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleRegistrations}>
                          {isRegistrationsOpen ? "Sim, Encerrar" : "Sim, Abrir"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 text-sm px-3 py-2 w-full justify-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Export Button */}
        <Card className="shadow-peaceful mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative w-full"> {/* Input Search ocupa toda a largura disponível */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, WhatsApp ou discipulador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full" 
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center md:justify-end w-full sm:w-auto"> {/* Botões empilham verticalmente em mobile */}
                {userRole === "discipulador" && (
                  <Button
                    variant={filterDiscipulado ? "default" : "outline"}
                    onClick={() => setFilterDiscipulado(!filterDiscipulado)}
                    className="flex items-center gap-2 text-sm px-3 py-2 w-full justify-center"
                  >
                    <Filter className="h-4 w-4" />
                    Ver Somente Inscrições do Meu Discipulado
                  </Button>
                )}

                <Button variant="secondary" onClick={handleExportXLSX} className="flex items-center gap-2 text-sm px-3 py-2 w-full justify-center">
                  <Download className="h-4 w-4" />
                  Baixar XLSX
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section (Total, Confirmados, Pendentes, Arrecadado) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"> 
          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-7 w-7 text-primary" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{filteredInscriptions.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total de Inscrições</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {filteredInscriptions.filter(i => i.status_pagamento === "Confirmado").length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pagamentos Confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{filteredInscriptions.filter(i => i.status_pagamento === "Pendente").length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pagamentos Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    R$ {filteredInscriptions
                      .filter(i => i.status_pagamento === "Confirmado")
                      .reduce((sum, i) => sum + i.valor, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Arrecadado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Section: Statistics by Função */}
        <Card className="shadow-peaceful mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
              <Users className="h-5 w-5" />
              Inscrições por Função
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> 
              <Card className="shadow-sm border">
                <CardContent className="pt-6 flex items-center gap-3">
                  <BookOpen className="h-7 w-7 text-green-600" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-green-700">{situationCounts.Encontrista || 0}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Encontristas</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardContent className="pt-6 flex items-center gap-3">
                  <Briefcase className="h-7 w-7 text-blue-600" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-700">{situationCounts.Equipe || 0}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Equipe</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardContent className="pt-6 flex items-center gap-3">
                  <Utensils className="h-7 w-7 text-yellow-600" />
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-yellow-700">{situationCounts.Cozinha || 0}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Cozinha</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Table - Condicionalmente renderizada como lista de cartões no mobile */}
        {isMobile ? (
          <div className="space-y-4"> {/* Container para os MobileInscriptionCard */}
            <Card className="shadow-divine">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-primary">
                  <Eye className="h-5 w-5" /> Inscrições
                </CardTitle>
              </CardHeader>
            </Card>
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
              <div className="overflow-x-auto"> {/* Garante que a tabela role horizontalmente em telas maiores */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Discipuladores</TableHead>
                      <TableHead>Líder</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Status Pagamento</TableHead>
                      <TableHead>Forma Pagamento</TableHead>
                      <TableHead>Valor</TableHead>
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
                        <TableCell className="text-sm">{inscription.whatsapp}</TableCell>
                        <TableCell className="text-sm">{inscription.irmao_voce_e}</TableCell>
                        <TableCell>
                          {editingId === inscription.id ? (
                            <Select 
                              value={editData.status_pagamento || ''}
                              onValueChange={(value) => setEditData({...editData, status_pagamento: value})}
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
                            >
                              <SelectTrigger className="w-[100px] text-xs sm:text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pix">Pix</SelectItem>
                                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                                <SelectItem value="Transferência">Transferência</SelectItem>
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
                            <Button size="sm" variant="outline" onClick={() => handleEdit(inscription)} className="px-2 py-1">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Management;