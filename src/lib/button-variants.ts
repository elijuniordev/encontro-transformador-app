// src/lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Gera um PDF a partir de um array de elementos HTML, colocando cada um em uma nova página.
 * @param elements Array de elementos HTML a serem convertidos.
 * @param fileName O nome do arquivo PDF a ser salvo.
 */
export const generatePdfFromElements = async (elements: HTMLElement[], fileName: string) => {
  const pdf = new jsPDF('p', 'mm', 'a4'); // Retrato, milímetros, A4
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 10; // Margem de 10mm

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element) continue;

    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a escala para melhor qualidade
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Adiciona uma nova página para cada elemento a partir do segundo
    if (i > 0) {
      pdf.addPage();
    }
    
    // Adiciona a imagem ao PDF, centralizada com margens
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
  }
  
  pdf.save(fileName);
};