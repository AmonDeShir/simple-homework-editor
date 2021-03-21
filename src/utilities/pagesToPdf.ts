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
  const canvasTemp = new Image();
  const background = new Image();

  background.src = page.image;
  await background.decode();

  const scale = calcScale(background.naturalWidth, background.naturalHeight, width, height);

  canvas.setAttribute('width', `${(background.naturalWidth) * scale}`);
  canvas.setAttribute('height', `${(background.naturalHeight) * scale}`);

  page.history.forEach((action) => drawHistoryAction(action, ctx, scale));
  canvasTemp.src = canvas.toDataURL('image/png');
  await canvasTemp.decode();

  Tools.all[0].prepareCanvas(ctx);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasTemp, 0, 0, canvasTemp.width, canvasTemp.height, 0, 0, canvas.width, canvas.height);

  return {
    src: canvas.toDataURL('image/png'),
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
      pdfPage.addImage(src, 'PNG', x / mmToPx, y / mmToPx, width / mmToPx, height / mmToPx);
    });

    pdf.deletePage(1);
    return pdf?.save('Done.pdf');
  }).catch(() => {});
}

export default pagesToPdf
