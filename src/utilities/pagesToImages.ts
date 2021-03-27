import { HistoryAction } from '../redux/interfaces/HistoryAction';
import { ImagePage } from '../redux/interfaces/Page';
import { HistoricalToolbox } from '../tools/Tool';
import Tools from '../tools/Tools';
import { Image } from './generatePdf';
import PdfUtils from './pdfUtils';

type Ctx2d = CanvasRenderingContext2D;

class PageToImage {
  private page: ImagePage;
  private resultImage: Promise<Image>;
  private background: Promise<HTMLImageElement>;

  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d') as Ctx2d;
  private scale = 0;

  constructor(page: ImagePage) {
    this.page = page;
    this.background = this.loadImage(this.page.data);
    this.resultImage = this.generateImage();
  }

  private async generateImage(): Promise<Image> {
    this.scale = await this.calcScale();

    await this.setCanvasSize();
    this.drawHistoryActions();

    const temp = await this.copyCanvasToTemp();

    this.clearCanvas();
    this.drawScaledImage(await this.background);
    this.drawScaledImage(temp);

    return {
      src: this.canvas.toDataURL('image/png'),
      width: this.canvas.width,
      height: this.canvas.height,
      x: 0,
      y: 0,
    };
  }

  private async loadImage(image: string) {
    const background = new window.Image();
    background.src = image;

    await background.decode();
    return background;
  }

  private async calcScale() {
    const background = await this.background;

    const widthScale = PdfUtils.pdfA4SizePx.width / background.naturalWidth;
    const heightScale = PdfUtils.pdfA4SizePx.height / background.naturalHeight;
    const scale = Math.min(widthScale, heightScale);

    return scale < 1 ? scale : 1;
  }

  private async setCanvasSize() {
    const background = await this.background;

    this.canvas.setAttribute(
      'width',
      `${background.naturalWidth * this.scale}`
    );

    this.canvas.setAttribute(
      'height',
      `${background.naturalHeight * this.scale}`
    );
  }

  private drawHistoryActions() {
    this.page.history.forEach((action) => {
      this.drawHistoryAction(action);
    });
  }

  private drawHistoryAction(action: HistoryAction) {
    const tool = Tools.all[action.toolId];
    const toolbox = this.getToolbox(action);

    tool.historyAction(toolbox);
  }

  private getToolbox(action: HistoryAction): HistoricalToolbox {
    return {
      ctx: this.ctx,
      history: action,
      step: action.step,
      actualPageSettings: {
        rotation: 0,
        scale: this.scale,
      },
    };
  }

  private async copyCanvasToTemp() {
    const temp = new window.Image();

    temp.src = this.canvas.toDataURL('image/png');
    await temp.decode();

    return temp;
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawScaledImage(image: HTMLImageElement) {
    this.ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  public get get() {
    return this.resultImage;
  }
}

type Callback = (images: Image[]) => void;

async function pagesToImages(pages: ImagePage[], onDone: Callback) {
  Promise.all(
    pages.map((page) => {
      return new PageToImage(page).get;
    })
  )
    .then((images) => onDone(images.map(PdfUtils.convertPxToMM)))
    .catch(() => {});
}

export default pagesToImages;
