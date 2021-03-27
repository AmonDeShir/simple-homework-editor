/* eslint-disable new-cap */
import jsPDF from 'jspdf';

export interface Placeable {
  width: number;
  height: number;
  x: number;
  y: number;
}

const pdfA4Page = new jsPDF('p', 'mm', 'a4');
const mmToPx = 3.779528;

const PdfUtils = {
  mmToPx,

  pdfA4Size: {
    width: pdfA4Page.internal.pageSize.getWidth(),
    height: pdfA4Page.internal.pageSize.getHeight(),
  },

  pdfA4SizePx: {
    width: pdfA4Page.internal.pageSize.getWidth() * mmToPx,
    height: pdfA4Page.internal.pageSize.getHeight() * mmToPx,
  },

  centerOnA4: <T extends Placeable>(object: T): T => {
    const pageSize = PdfUtils.pdfA4Size;

    return {
      ...object,
      x: (pageSize.width - object.width) / 2,
      y: (pageSize.height - object.height) / 2,
    };
  },

  convertPxToMM: <T extends Placeable>(object: T): T => {
    return {
      ...object,
      width: object.width / PdfUtils.mmToPx,
      height: object.height / PdfUtils.mmToPx,
      x: object.x / PdfUtils.mmToPx,
      y: object.y / PdfUtils.mmToPx,
    };
  },
};

export default PdfUtils;
