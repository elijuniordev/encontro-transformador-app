// src/lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Gera um PDF a partir de um elemento HTML.
 * @param element O elemento HTML a ser convertido em PDF.
 * @param fileName O nome do arquivo PDF a ser salvo.
 */
export const generatePdfFromElement = (element: HTMLElement, fileName: string) => {
  // Usa o html2canvas para capturar o elemento como uma imagem com alta resolução
  html2canvas(element, { 
    scale: 2, // Aumenta a escala para melhor qualidade de imagem
    useCORS: true, // Permite carregar imagens de outras origens se houver
    logging: false, // Desativa logs no console
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); // Orientação retrato, em milímetros, formato A4

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calcula a proporção para a imagem se ajustar à largura do PDF com margens
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth - 20; // Largura da imagem com margem de 10mm de cada lado
    const imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 10; // Margem superior inicial de 10mm

    // Adiciona a primeira página
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20); // Subtrai a altura visível (com margens)

    // Adiciona novas páginas se o conteúdo for maior que uma página
    while (heightLeft > 0) {
      position = heightLeft - imgHeight - 10; // Ajusta a posição da imagem na nova página
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }
    
    // Salva o arquivo PDF
    pdf.save(fileName);
  });
};