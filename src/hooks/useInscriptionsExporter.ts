// src/hooks/useInscriptionsExporter.ts
import { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Inscription } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useInscriptionsExporter = (inscriptions: Inscription[]) => {
    const { toast } = useToast();

    const handleExportXLSX = useCallback(() => {
        const dataToExport = inscriptions.map(inscription => ({
            "ID": inscription.id, "Nome Completo": inscription.nome_completo, "Discipuladores": inscription.discipuladores, "Líder": inscription.lider,
            "Anjo da Guarda": inscription.anjo_guarda, "Sexo": inscription.sexo, "Idade": inscription.idade, "WhatsApp": inscription.whatsapp,
            "Função": inscription.irmao_voce_e, "Resp. 1 Nome": inscription.responsavel_1_nome, "Resp. 1 WhatsApp": inscription.responsavel_1_whatsapp,
            "Resp. 2 Nome": inscription.responsavel_2_nome, "Resp. 2 WhatsApp": inscription.responsavel_2_whatsapp, "Resp. 3 Nome": inscription.responsavel_3_nome,
            "Resp. 3 WhatsApp": inscription.responsavel_3_whatsapp, "Status Pagamento": inscription.status_pagamento, "Forma Pagamento": inscription.forma_pagamento,
            "Valor": inscription.valor, "Observação": inscription.observacao, "Data Inscrição": new Date(inscription.created_at).toLocaleDateString('pt-BR'),
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wscols = [
            { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 8 }, { wch: 6 }, { wch: 15 }, { wch: 12 }, { wch: 25 },
            { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 10 }, { wch: 30 }, { wch: 15 },
        ];
        ws['!cols'] = wscols;

        if (dataToExport.length > 0) { ws['!autofilter'] = { ref: ws['!ref'] }; }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inscrições");
        XLSX.writeFile(wb, "inscricoes_encontro_com_deus.xlsx");

        toast({ title: "Exportação concluída", description: "Os dados foram exportados." });
    }, [inscriptions, toast]);

    return { handleExportXLSX };
};