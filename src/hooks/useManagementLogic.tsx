// src/hooks/useManagementLogic.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import * as XLSX from 'xlsx';
import { Inscription } from "@/types/supabase";
import {
  DISCIPULADORES_OPTIONS as DISCIPULADORES_OPTIONS_FOR_FILTER,
  STATUS_PAGAMENTO_OPTIONS,
  IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS,
  FORMA_PAGAMENTO_OPTIONS,
  SEXO_OPTIONS,
} from "@/config/options";

export const useManagementLogic = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipulado, setFilterDiscipulado] = useState(false);

  const [filterByFuncao, setFilterByFuncao] = useState("all");
  const [filterByStatusPagamento, setFilterByStatusPagamento] = useState("all");
  const [filterByDiscipuladoGroup, setFilterByDiscipuladoGroup] = useState("all");
  const [filterBySexo, setFilterBySexo] = useState("all");

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(false);
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
    setIsLoading(true);
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

    const settingsId = '8ff1cff8-2c26-4cc4-b2bf-7faa5612b747';

    const { error } = await supabase
      .from('event_settings')
      .update({ registrations_open: newStatus })
      .eq('id', settingsId);

    if (error) {
      console.error("Erro ao atualizar status das inscrições:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível alterar o status das inscrições.",
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
      // <<< INÍCIO DA CORREÇÃO >>>
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = inscription.nome_completo.toLowerCase().includes(lowerCaseSearchTerm) ||
                          inscription.whatsapp.toLowerCase().includes(lowerCaseSearchTerm) ||
                          inscription.discipuladores.toLowerCase().includes(lowerCaseSearchTerm);

      const matchesDiscipuladoByLoggedInUser = !filterDiscipulado || (userDiscipulado && inscription.discipuladores.toLowerCase() === userDiscipulado.toLowerCase());

      const matchesFuncao = filterByFuncao === "all" || inscription.irmao_voce_e === filterByFuncao;
      const matchesStatusPagamento = filterByStatusPagamento === "all" || inscription.status_pagamento === filterByStatusPagamento;
      
      const matchesDiscipuladoGroup = filterByDiscipuladoGroup === "all" || inscription.discipuladores.toLowerCase() === filterByDiscipuladoGroup.toLowerCase();
      // <<< FIM DA CORREÇÃO >>>

      const matchesSexo = filterBySexo === "all" || inscription.sexo === filterBySexo.toLowerCase();

      return matchesSearch && matchesDiscipuladoByLoggedInUser && matchesFuncao && matchesStatusPagamento && matchesDiscipuladoGroup && matchesSexo;
    });
  }, [
    inscriptions,
    searchTerm,
    filterDiscipulado,
    userDiscipulado,
    filterByFuncao,
    filterByStatusPagamento,
    filterByDiscipuladoGroup,
    filterBySexo
  ]);

  const situationCounts = useMemo(() => {
      const counts: { [key: string]: number } = {};
      counts['Total'] = filteredInscriptions.length;

      FUNCAO_OPTIONS.forEach(option => counts[option] = 0);

      filteredInscriptions.forEach(inscription => {
        if (inscription.irmao_voce_e === "Pastor, obreiro ou discipulador") {
          counts["Equipe"] = (counts["Equipe"] || 0) + 1;
        } else if (inscription.irmao_voce_e) {
          counts[inscription.irmao_voce_e] = (counts[inscription.irmao_voce_e] || 0) + 1;
        }
      });

      delete counts["Pastor, obreiro ou discipulador"]; 

      return counts;
    }, [filteredInscriptions]);

  const paymentMethodCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    [...FORMA_PAGAMENTO_OPTIONS, ...STATUS_PAGAMENTO_OPTIONS].forEach(option => counts[option] = 0);
    filteredInscriptions.forEach(inscription => {
      if (inscription.status_pagamento === 'Confirmado' && inscription.forma_pagamento) {
        const key = inscription.forma_pagamento;
        if (Object.hasOwn(counts, key)) {
          counts[key]++;
        } else {
          counts[key] = (counts[key] || 0) + 1;
        }
      }

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
      "Isento": "outline",
      "Pagamento Incompleto": "outline", // <-- ADICIONE ESTA LINHA
    };
    const colorClass = status === "Pagamento Incompleto" ? "border-yellow-500 text-yellow-700" : "";
    return <Badge variant={variants[status] || "outline"} className={colorClass}>{status}</Badge>;
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('inscriptions')
      .delete()
      .eq('id', id);

    if (error) {
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
  }, [fetchInscriptions, toast]);
  
  const handleExportXLSX = useCallback(() => {
    const dataToExport = filteredInscriptions.map(inscription => ({
        "ID": inscription.id, "Nome Completo": inscription.nome_completo, "Discipuladores": inscription.discipuladores, "Líder": inscription.lider,
        "Anjo da Guarda": inscription.anjo_guarda, "Sexo": inscription.sexo, "Idade": inscription.idade, "WhatsApp": inscription.whatsapp,
        "Função": inscription.irmao_voce_e, "Resp. 1 Nome": inscription.responsavel_1_nome, "Resp. 1 WhatsApp": inscription.responsavel_1_whatsapp,
        "Resp. 2 Nome": inscription.responsavel_2_nome, "Resp. 2 WhatsApp": inscription.responsavel_2_whatsapp, "Resp. 3 Nome": inscription.responsavel_3_nome,
        "Resp. 3 WhatsApp": inscription.responsavel_3_whatsapp, "Status Pagamento": inscription.status_pagamento, "Forma Pagamento": inscription.forma_pagamento,
        "Valor": inscription.valor, "Observação": inscription.observacao, "Data Inscrição": new Date(inscription.created_at).toLocaleDateString('pt-BR'),
      }));
  
      const ws = XLSX.utils.json_to_sheet(dataToExport);
  
      const wscols = [
          {wch: 10}, {wch: 25}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 8}, {wch: 6}, {wch: 15}, {wch: 12}, {wch: 25},
          {wch: 18}, {wch: 25}, {wch: 18}, {wch: 25}, {wch: 18}, {wch: 18}, {wch: 18}, {wch: 10}, {wch: 30}, {wch: 15},
      ];
      ws['!cols'] = wscols;
  
      if (dataToExport.length > 0) { ws['!autofilter'] = { ref: ws['!ref'] }; }
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inscrições");
      XLSX.writeFile(wb, "inscricoes_encontro_com_deus.xlsx");
  
      toast({ title: "Exportação concluída", description: "Os dados foram exportados." });
  }, [filteredInscriptions, toast]);

  return {
    searchTerm, setSearchTerm, filterDiscipulado, setFilterDiscipulado, filterByFuncao, setFilterByFuncao,
    filterByStatusPagamento, setFilterByStatusPagamento, filterByDiscipuladoGroup, setFilterByDiscipuladoGroup,
    inscriptions, filteredInscriptions, situationCounts, paymentMethodCounts, isRegistrationsOpen, userRole,
    userEmail, userDiscipulado, isAuthenticated, isLoading, handleLogout, handleToggleRegistrations,
    getStatusBadge, handleDelete, handleExportXLSX, fetchInscriptions, funcaoOptions: FUNCAO_OPTIONS,
    statusPagamentoOptions: STATUS_PAGAMENTO_OPTIONS, discipuladoGroupOptions: DISCIPULADORES_OPTIONS_FOR_FILTER,
    formaPagamentoOptions: FORMA_PAGAMENTO_OPTIONS,sexoOptions: SEXO_OPTIONS, filterBySexo, setFilterBySexo,
  };
};