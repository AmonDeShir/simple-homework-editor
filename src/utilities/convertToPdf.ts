/* eslint-disable prettier/prettier */
/* eslint-disable new-cap */
import jsPDF from 'jspdf';
import PdfUtils, { Placeable } from './pdfUtils';

export interface Image extends Placeable {
  src: string
}

function generatePdf(images: Image[]) {
  const pdf = new jsPDF('p', 'mm', 'a4');

  images.forEach((image) => {
    const pdfPage = pdf.addPage('a4', 'p');
    const { src, x, y, width, height } = PdfUtils.centerOnA4(image);

    pdfPage.addImage(src, 'PNG', x, y, width, height);
  });

  pdf.deletePage(1);
  pdf?.save('Done.pdf');
}

export default generatePdf
