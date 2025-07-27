// src/hooks/useManagementLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import * as XLSX from 'xlsx';

// Definindo opções para filtros que são constantes
const FUNCAO_OPTIONS = ["Encontrista", "Equipe", "Cozinha"];
const STATUS_PAGAMENTO_OPTIONS = ["Pendente", "Confirmado", "Cancelado", "Isento"];

// Importar DISCIPULADORES_OPTIONS e LIDERES_MAP do useInscriptionFormLogic para reutilização
// Certifique-se de que DISCIPULADORES_OPTIONS não inclua "Sou Obreiro..." se não for um grupo de discipulado real para filtro
// Se DISCIPULADORES_OPTIONS for grande, você pode considerar buscar dinamicamente os grupos únicos de discipuladores do DB.
const DISCIPULADORES_OPTIONS_FOR_FILTER = [
  "Arthur e Beatriz",
  "José Gomes e Edna",
  "Rosana",
  "Isaac e Andrea",
  "Rafael Ângelo e Ingrid"
  // Não incluir "Sou Obreiro, Discipulador ou Pastor" aqui se ele não representa um grupo filtrável
];


interface Inscription {
  id: string;
  discipuladores: string;
  lider: string;
  nome_completo: string;
  anjo_guarda: string;
  sexo: string;
  idade: string;
  whatsapp: string;
  irmao_voce_e: string; // Corresponde à situacao do formulário
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

export const useManagementLogic = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipulado, setFilterDiscipulado] = useState(false); // Flag para filtrar pelo discipulador logado
  
  // Novos estados para os filtros adicionais
  const [filterByFuncao, setFilterByFuncao] = useState("");
  const [filterByStatusPagamento, setFilterByStatusPagamento] = useState("");
  const [filterByDiscipuladoGroup, setFilterByDiscipuladoGroup] = useState(""); // Para o novo filtro dropdown de discipulados

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inscription>>({});
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const userDiscipulado = localStorage.getItem("userDiscipulado");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  console.log('useManagementLogic - User Role:', userRole, 'Is Authenticated:', isAuthenticated);
  console.log('useManagementLogic - isRegistrationsOpen state:', isRegistrationsOpen);

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

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userDiscipulado");
    navigate("/");
  }, [navigate]);

  const handleToggleRegistrations = useCallback(async () => {
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
  }, [isRegistrationsOpen, toast]);

  const filteredInscriptions = useMemo(() => {
    return inscriptions.filter(inscription => {
      const matchesSearch = inscription.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inscription.whatsapp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inscription.discipuladores.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDiscipuladoByLoggedInUser = !filterDiscipulado || (userDiscipulado && inscription.discipuladores === userDiscipulado);
      
      // Novos filtros
      const matchesFuncao = !filterByFuncao || inscription.irmao_voce_e === filterByFuncao;
      const matchesStatusPagamento = !filterByStatusPagamento || inscription.status_pagamento === filterByStatusPagamento;
      const matchesDiscipuladoGroup = !filterByDiscipuladoGroup || inscription.discipuladores === filterByDiscipuladoGroup;

      return matchesSearch && matchesDiscipuladoByLoggedInUser && matchesFuncao && matchesStatusPagamento && matchesDiscipuladoGroup;
    });
  }, [
    inscriptions,
    searchTerm,
    filterDiscipulado,
    userDiscipulado,
    filterByFuncao,
    filterByStatusPagamento,
    filterByDiscipuladoGroup
  ]);

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

  const paymentMethodCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      Pix: 0,
      'Cartão de Crédito': 0,
      'CartaoCredito2x': 0,
      'CartaoDebito': 0,
      'Dinheiro': 0,
      'Pendente': 0,
      'Cancelado': 0,
      'Isento': 0,
    };
    filteredInscriptions.forEach(inscription => {
      const key = inscription.forma_pagamento;
      if (key && Object.hasOwn(counts, key)) {
        counts[key]++;
      } else if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [filteredInscriptions]);


  const getStatusBadge = useCallback((status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Confirmado": "default",
      "Pendente": "secondary",
      "Cancelado": "destructive",
      "Isento": "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  }, []);

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
      fetchInscriptions(); // Re-buscar os dados após salvar
    }

    setEditingId(null);
    setEditData({});
  }, [editingId, editData, fetchInscriptions, toast]);

  const handleExportXLSX = useCallback(() => {
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
  }, [filteredInscriptions, toast]);


  return {
    searchTerm,
    setSearchTerm,
    filterDiscipulado,
    setFilterDiscipulado,
    filterByFuncao,
    setFilterByFuncao,
    filterByStatusPagamento,
    setFilterByStatusPagamento,
    filterByDiscipuladoGroup,
    setFilterByDiscipuladoGroup,
    inscriptions,
    filteredInscriptions,
    situationCounts,
    paymentMethodCounts,
    editingId,
    setEditingId,
    editData,
    setEditData,
    isRegistrationsOpen,
    userRole,
    userEmail,
    userDiscipulado,
    isAuthenticated,
    handleLogout,
    handleToggleRegistrations,
    getStatusBadge,
    handleEdit,
    handleSaveEdit,
    handleExportXLSX,
    fetchInscriptions,
    funcaoOptions: FUNCAO_OPTIONS, // Exportando as opções
    statusPagamentoOptions: STATUS_PAGAMENTO_OPTIONS, // Exportando as opções
    discipuladoGroupOptions: DISCIPULADORES_OPTIONS_FOR_FILTER, // Exportando as opções
  };
};