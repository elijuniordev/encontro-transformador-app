// src/hooks/useInscriptionsExporter.ts
import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Inscription } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useInscriptionsExporter = (inscriptions: Inscription[]) => {
    const { toast } = useToast();

    const handleExportXLSX = useCallback(() => {
        if (inscriptions.length === 0) {
            toast({
                title: "Nenhuma inscrição",
                description: "Não há dados para exportar.",
                variant: "destructive",
            });
            return;
        }

        // --- 1. Preparando os Dados para cada Aba ---

        // Aba: Inscrições Gerais
        const generalData = inscriptions.map(p => {
            const contacts = [
                p.responsavel_1_nome && `${p.responsavel_1_nome} (${p.responsavel_1_whatsapp || 'N/A'})`,
                p.responsavel_2_nome && `${p.responsavel_2_nome} (${p.responsavel_2_whatsapp || 'N/A'})`,
                p.responsavel_3_nome && `${p.responsavel_3_nome} (${p.responsavel_3_whatsapp || 'N/A'})`
            ].filter(Boolean).join('\n'); // Junta com quebra de linha

            return {
                "Nome Completo": p.nome_completo,
                "Função": p.irmao_voce_e,
                "Sexo": p.sexo,
                "Idade": p.idade,
                "Discipulador": p.discipuladores,
                "Líder": p.lider,
                "Status Pagamento": p.status_pagamento,
                "Contatos de Emergência": contacts || "N/A",
                "Observação": p.observacao || "",
                "Data Inscrição": new Date(p.created_at).toLocaleDateString('pt-BR'),
            };
        });

        // Aba: Relatório Financeiro
        const financialData = inscriptions.map(p => {
            const saldoDevedor = p.total_value - p.paid_amount;
            return {
                "Nome Completo": p.nome_completo,
                "Status": p.status_pagamento,
                "Valor Total": p.total_value,
                "Valor Pago": p.paid_amount,
                "Saldo Devedor": saldoDevedor < 0 ? 0 : saldoDevedor,
            };
        });
        
        // Aba: Contatos Detalhados
        const contactsData = inscriptions.map(p => ({
            "Nome Completo": p.nome_completo,
            "WhatsApp Pessoal": p.whatsapp,
            "Responsável 1": p.responsavel_1_nome || "N/A",
            "WhatsApp Resp. 1": p.responsavel_1_whatsapp || "N/A",
            "Responsável 2": p.responsavel_2_nome || "N/A",
            "WhatsApp Resp. 2": p.responsavel_2_whatsapp || "N/A",
            "Responsável 3": p.responsavel_3_nome || "N/A",
            "WhatsApp Resp. 3": p.responsavel_3_whatsapp || "N/A",
        }));

        // --- 2. Criando as Planilhas (Worksheets) ---
        
        const wsGeneral = XLSX.utils.json_to_sheet(generalData);
        const wsFinancial = XLSX.utils.json_to_sheet(financialData);
        const wsContacts = XLSX.utils.json_to_sheet(contactsData);

        // --- 3. Aplicando Formatação e Estilos ---

        // Largura das colunas
        wsGeneral['!cols'] = [ { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 8 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 35 }, { wch: 40 }, { wch: 15 } ];
        wsFinancial['!cols'] = [ { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 } ];
        wsContacts['!cols'] = [ { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 } ];

        // Formato de moeda para a aba financeira
        const currencyFormat = 'R$ #,##0.00';
        financialData.forEach((_row, index) => {
            const rowIndex = index + 2; // +1 para o header, +1 porque é 1-based
            ['C', 'D', 'E'].forEach(col => {
                const cellRef = `${col}${rowIndex}`;
                if (wsFinancial[cellRef]) {
                    wsFinancial[cellRef].z = currencyFormat;
                }
            });
        });
        
        // Adicionar AutoFiltro em todas as abas
        if (wsGeneral['!ref']) wsGeneral['!autofilter'] = { ref: wsGeneral['!ref'] };
        if (wsFinancial['!ref']) wsFinancial['!autofilter'] = { ref: wsFinancial['!ref'] };
        if (wsContacts['!ref']) wsContacts['!autofilter'] = { ref: wsContacts['!ref'] };


        // --- 4. Montando e Baixando o Arquivo ---
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsGeneral, "Inscrições Gerais");
        XLSX.utils.book_append_sheet(wb, wsFinancial, "Relatório Financeiro");
        XLSX.utils.book_append_sheet(wb, wsContacts, "Contatos de Emergência");

        XLSX.writeFile(wb, "relatorio_encontro_com_deus.xlsx");

        toast({ title: "Exportação concluída", description: "O arquivo Excel foi baixado com sucesso." });
    }, [inscriptions, toast]);

    return { handleExportXLSX };
};