// src/hooks/useManagementLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import * as XLSX from 'xlsx';

// Definindo opções para filtros que são constantes
const FUNCAO_OPTIONS = ["Encontrista", "Equipe", "Acompanhante", "Cozinha"];
const STATUS_PAGAMENTO_OPTIONS = ["Pendente", "Confirmado", "Cancelado", "Isento"];

const DISCIPULADORES_OPTIONS_FOR_FILTER = [
  "Arthur e Beatriz",
  "José Gomes e Edna",
  "Rosana",
  "Isaac e Andrea",
  "Rafael Ângelo e Ingrid"
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

export const useManagementLogic = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipulado, setFilterDiscipulado] = useState(false);
  
  const [filterByFuncao, setFilterByFuncao] = useState("all");
  const [filterByStatusPagamento, setFilterByStatusPagamento] = useState("all");
  const [filterByDiscipuladoGroup, setFilterByDiscipuladoGroup] = useState("all");

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inscription>>({});
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);

  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const userDiscipulado = localStorage.getItem("userDiscipulado");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

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
      
      const matchesFuncao = filterByFuncao === "all" || inscription.irmao_voce_e === filterByFuncao;
      const matchesStatusPagamento = filterByStatusPagamento === "all" || inscription.status_pagamento === filterByStatusPagamento;
      const matchesDiscipuladoGroup = filterByDiscipuladoGroup === "all" || inscription.discipuladores === filterByDiscipuladoGroup;

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
      Acompanhante: 0,
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
      'Confirmado': 0,
      'Cancelado': 0,
      'Isento': 0,
    };
    filteredInscriptions.forEach(inscription => {
      // Conta as formas de pagamento para pagamentos confirmados
      if (inscription.status_pagamento === 'Confirmado' && inscription.forma_pagamento) {
        const key = inscription.forma_pagamento;
        if (Object.hasOwn(counts, key)) {
          counts[key]++;
        } else {
          counts[key] = (counts[key] || 0) + 1;
        }
      }
      
      // Conta os status de pagamento (Pendente, Cancelado, Isento)
      const statusKey = inscription.status_pagamento;
      if (statusKey && Object.hasOwn(counts, statusKey)) {
        counts[statusKey]++;
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
      fetchInscriptions();
    }

    setEditingId(null);
    setEditData({});
  }, [editingId, editData, fetchInscriptions, toast]);
  
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta inscrição? Esta ação não pode ser desfeita.")) {
      const { error } = await supabase
        .from('inscriptions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao excluir inscrição:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir a inscrição. Tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Inscrição excluída",
          description: "A inscrição foi removida com sucesso.",
        });
        fetchInscriptions();
      }
    }
  }, [fetchInscriptions, toast]);

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

    // 1. Definir larguras de coluna
    const wscols = [
        {wch: 10}, // ID
        {wch: 25}, // Nome Completo
        {wch: 20}, // Discipuladores
        {wch: 20}, // Líder
        {wch: 20}, // Anjo da Guarda
        {wch: 8},  // Sexo
        {wch: 6},  // Idade
        {wch: 15}, // WhatsApp
        {wch: 12}, // Função
        {wch: 25}, // Resp. 1 Nome
        {wch: 18}, // Resp. 1 WhatsApp
        {wch: 25}, // Resp. 2 Nome
        {wch: 18}, // Resp. 2 WhatsApp
        {wch: 25}, // Resp. 3 Nome
        {wch: 18}, // Resp. 3 WhatsApp
        {wch: 18}, // Status Pagamento
        {wch: 18}, // Forma Pagamento
        {wch: 10}, // Valor
        {wch: 30}, // Observação
        {wch: 15}, // Data Inscrição
    ];
    ws['!cols'] = wscols;

    // 2. Adicionar auto-filtro aos cabeçalhos
    if (dataToExport.length > 0) {
        // Obter o range atual da planilha (ex: "A1:T" + (dataToExport.length + 1))
        const range = XLSX.utils.decode_range(ws['!ref'] || "A1");
        // Ajustar o range para incluir apenas a linha do cabeçalho
        ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: range.s.r, c: range.s.c }, e: { r: range.s.r, c: range.e.c } }) };
        // Para aplicar o filtro a todas as linhas de dados, o ref deve incluir a última linha de dados.
        // O ref completo para autoFilter deve ser A1:LastColumnLastRow
        ws['!autofilter'] = { ref: ws['!ref'] };
    }


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
    handleDelete,
    handleExportXLSX,
    fetchInscriptions,
    funcaoOptions: FUNCAO_OPTIONS,
    statusPagamentoOptions: STATUS_PAGAMENTO_OPTIONS,
    discipuladoGroupOptions: DISCIPULADORES_OPTIONS_FOR_FILTER,
  };
};