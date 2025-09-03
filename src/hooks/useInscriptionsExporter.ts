// src/hooks/useInscriptionsExporter.ts
import { useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Inscription, Payment } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

export const useInscriptionsExporter = (
    inscriptions: Inscription[], 
    payments: Payment[],
    chartRef: React.RefObject<HTMLDivElement>
) => {
    const { toast } = useToast();

    const applyHeaderStyles = (worksheet: ExcelJS.Worksheet) => {
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F4F4F' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
    };

    const handleExportXLSX = useCallback(async () => {
        if (inscriptions.length === 0) {
            toast({
                title: "Nenhuma inscrição",
                description: "Não há dados para exportar.",
                variant: "destructive",
            });
            return;
        }

        toast({ title: "Gerando relatório...", description: "Aguarde enquanto preparamos o arquivo Excel." });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'DevDesigner';
        workbook.created = new Date();

        // --- 1. Aba: Resumo por Método (com Gráfico) ---
        const summarySheet = workbook.addWorksheet('Resumo por Método');
        const summaryByMethod: { [key: string]: number } = {};
        payments.forEach(payment => {
            const method = payment.payment_method || 'Não especificado';
            if (!summaryByMethod[method]) {
                summaryByMethod[method] = 0;
            }
            summaryByMethod[method] += payment.amount;
        });
        const summaryData = Object.entries(summaryByMethod).map(([method, total]) => ({ method, total }));
        
        summarySheet.columns = [
            { header: 'Forma de Pagamento', key: 'method', width: 30 },
            { header: 'Valor Total Arrecadado', key: 'total', width: 30, style: { numFmt: '"R$" #,##0.00' } },
        ];
        summarySheet.addRows(summaryData);
        applyHeaderStyles(summarySheet);

        // Adicionar imagem do gráfico
        if (chartRef.current && summaryData.length > 0) {
            try {
                const canvas = await html2canvas(chartRef.current, { backgroundColor: null, scale: 2 });
                const imageBase64 = canvas.toDataURL('image/png');
                const imageId = workbook.addImage({
                    base64: imageBase64,
                    extension: 'png',
                });
                summarySheet.addImage(imageId, {
                    tl: { col: 3, row: 1 }, // Canto superior esquerdo (Coluna D, Linha 2)
                    ext: { width: 500, height: 350 } // Tamanho da imagem
                });
            } catch (error) {
                console.error("Erro ao gerar a imagem do gráfico:", error);
                toast({ title: "Aviso", description: "Não foi possível gerar a imagem do gráfico, mas os dados foram exportados.", variant: "default" });
            }
        }

        // --- 2. Aba: Relatório Financeiro ---
        const financialSheet = workbook.addWorksheet('Relatório Financeiro');
        financialSheet.columns = [
            { header: 'Nome Completo', key: 'name', width: 35 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Formas de Pagamento', key: 'methods', width: 25 },
            { header: 'Valor Total', key: 'total', width: 15, style: { numFmt: '"R$" #,##0.00' } },
            { header: 'Valor Pago', key: 'paid', width: 15, style: { numFmt: '"R$" #,##0.00' } },
            { header: 'Saldo Devedor', key: 'due', width: 15, style: { numFmt: '"R$" #,##0.00' } },
        ];
        inscriptions.map(p => {
            const inscriptionPayments = payments.filter(pay => pay.inscription_id === p.id);
            const paymentMethods = [...new Set(inscriptionPayments.map(pay => pay.payment_method))].join(', ');
            const saldoDevedor = p.total_value - p.paid_amount;
            return {
                name: p.nome_completo,
                status: p.status_pagamento,
                methods: paymentMethods || 'N/A',
                total: p.total_value,
                paid: p.paid_amount,
                due: saldoDevedor < 0 ? 0 : saldoDevedor,
            };
        }).forEach(row => financialSheet.addRow(row));
        applyHeaderStyles(financialSheet);

        // --- 3. Aba: Inscrições Gerais ---
        const generalSheet = workbook.addWorksheet('Inscrições Gerais');
        generalSheet.columns = [
            { header: 'Nome Completo', key: 'name', width: 35 },
            { header: 'Função', key: 'role', width: 20 },
            { header: 'Sexo', key: 'gender', width: 10 },
            { header: 'Discipulador', key: 'discipler', width: 25 },
            { header: 'Líder', key: 'leader', width: 25 },
            { header: 'Status Pagamento', key: 'paymentStatus', width: 20 },
            { header: 'Observação', key: 'obs', width: 40 },
        ];
        inscriptions.forEach(p => generalSheet.addRow({
            name: p.nome_completo, role: p.irmao_voce_e, gender: p.sexo,
            discipler: p.discipuladores, leader: p.lider, paymentStatus: p.status_pagamento,
            obs: p.observacao || ''
        }));
        applyHeaderStyles(generalSheet);
        
        // --- 4. Aba: Contatos ---
        const contactsSheet = workbook.addWorksheet('Contatos de Emergência');
        contactsSheet.columns = [
            { header: 'Nome Completo', key: 'name', width: 35 },
            { header: 'WhatsApp Pessoal', key: 'whatsapp', width: 20 },
            { header: 'Resp. 1', key: 'r1n', width: 30 }, { header: 'WhatsApp Resp. 1', key: 'r1w', width: 20 },
            { header: 'Resp. 2', key: 'r2n', width: 30 }, { header: 'WhatsApp Resp. 2', key: 'r2w', width: 20 },
        ];
        inscriptions.forEach(p => contactsSheet.addRow({
            name: p.nome_completo, whatsapp: p.whatsapp,
            r1n: p.responsavel_1_nome, r1w: p.responsavel_1_whatsapp,
            r2n: p.responsavel_2_nome, r2w: p.responsavel_2_whatsapp,
        }));
        applyHeaderStyles(contactsSheet);
        
        // --- Gerar e Baixar o Arquivo ---
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `relatorio_encontro_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`);

        toast({ title: "Exportação concluída", description: "O arquivo Excel foi baixado com sucesso." });

    }, [inscriptions, payments, toast, chartRef]);

    return { handleExportXLSX };
};