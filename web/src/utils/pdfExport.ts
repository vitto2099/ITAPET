import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PetRegistration } from '../types';

/**
 * Exporta a Carteira de Identificação Animal Oficial do ItaPet para PDF em alta resolução (300 DPI)
 * e oferece compartilhamento direto para o WhatsApp do munícipe via Web Share API quando em dispositivos móveis.
 */
export async function exportPetCardToPdf(pet: PetRegistration, element: HTMLElement): Promise<boolean> {
  try {
    // 1. Renderiza o elemento em alta resolução (escala 2.5x)
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // 2. Cria documento PDF no padrão Cartão Passaporte (148 x 105 mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [148, 105]
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    const safeName = (pet.nomeAnimal || 'pet').replace(/\s+/g, '_');
    const fileName = `ItaPet_Passaporte_${safeName}_${pet.microchip || 'doc'}.pdf`;

    // 3. Compartilhamento nativo via Web Share API (Android e iOS) para envio no WhatsApp
    const pdfBlob = pdf.output('blob');
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        files: [pdfFile],
        title: `Carteira Oficial ItaPet - ${pet.nomeAnimal}`,
        text: `Segue a Carteira de Identificação Animal Oficial do ItaPet (Prefeitura de Itaiópolis - SC) de ${pet.nomeAnimal}. Microchip: ${pet.microchip || 'N/A'}`
      });
      return true;
    }

    // 4. Fallback no desktop: Download direto do arquivo PDF
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF da carteirinha:', error);
    return false;
  }
}
