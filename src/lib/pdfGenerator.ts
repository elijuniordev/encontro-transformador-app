// src/lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Gera um PDF a partir de um array de elementos HTML, colocando cada um em uma nova página.
 * @param elements Array de elementos HTML a serem convertidos.
 * @param fileName O nome do arquivo PDF a ser salvo.
 */
export const generatePdfFromElements = async (elements: HTMLElement[], fileName: string) => {
  if (elements.length === 0) {
    console.error("Nenhum elemento fornecido para gerar o PDF.");
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4'); // Retrato, milímetros, A4
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pdfWidth - margin * 2;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element) continue;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    if (i > 0) {
      pdf.addPage();
    }
    
    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, imgHeight);
  }
  
  pdf.save(fileName);
};