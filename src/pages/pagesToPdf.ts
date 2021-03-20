/* eslint-disable prettier/prettier */
/* eslint-disable new-cap */
import jsPDF from 'jspdf';
import { HistoryAction } from '../redux/interfaces/HistoryAction';
import { Page } from '../redux/interfaces/Page';
import Tools from '../tools/Tools';

type Ctx2d = CanvasRenderingContext2D;

const drawHistoryAction = (action: HistoryAction, ctx: Ctx2d, new_scale: number) => {
  const { scale, settings, toolId, x, y } = action;
  const tool = Tools.all[toolId];

  if (toolId === Tools.FINISH_DRAW_TOOL) {
    Tools.all[0].finishDrawing(ctx);
    return;
  }

  tool.setSettings({...settings, brushSize: settings.brushSize * new_scale});
  tool.prepareCanvas(ctx);
  tool.draw(Math.floor(x / scale) * new_scale, Math.floor(y / scale) * new_scale, ctx);
};

const calcScale = (imageWidth: number, imageHeight: number, pdfWidth: number, pdfHeight: number) => {
  const widthScale = (pdfWidth / imageWidth);
  const heightScale = (pdfHeight / imageHeight);
  const scale = Math.min(widthScale, heightScale);

  return scale < 1 ? scale : 1;
};

const generateImageByCanvas = async (page: Page, width: number, height: number) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as Ctx2d;
  const img = new Image();

  img.src = page.image;

  await img.decode();

  const scale = calcScale(img.naturalWidth, img.naturalHeight, width, height);

  canvas.setAttribute('width', `${(img.naturalWidth) * scale}`);
  canvas.setAttribute('height', `${(img.naturalHeight) * scale}`);

  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  page.history.forEach((action) => drawHistoryAction(action, ctx, scale));
  document.body.appendChild(canvas);

  return {
    src: canvas.toDataURL('image/jpeg'),
    width: canvas.width ,
    height: canvas.height,
    x:(width - canvas.width) / 2,
    y:(height - canvas.height) / 2,
  };
};

function pagesToPdf(pages: Page[]) {
  const mmToPx = 3.779528;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfSize = pdf.internal.pageSize;
  const pdfWidth = pdfSize.getWidth();
  const pdfHeight = pdfSize.getHeight();

  const imgsProise = pages.map((page) => {
    return generateImageByCanvas(page, pdfWidth * mmToPx, pdfHeight * mmToPx);
  });

  Promise.all(imgsProise).then((imgs) => {
    imgs.forEach(({ src, x, y, width, height }) => {
      const pdfPage = pdf.addPage('a4', 'p');
      pdfPage.addImage(src, 'JPEG', x / mmToPx, y / mmToPx, width / mmToPx, height / mmToPx);
    });

    pdf.deletePage(1);
    return pdf?.save('Done.pdf');
  }).catch(() => {});
}

export default pagesToPdf
