import { HistoryAction } from '../redux/interfaces/HistoryAction';
import { Page } from '../redux/interfaces/Page';
import Tools from '../tools/Tools';
import { Image } from './convertToPdf';
import PdfUtils from './pdfUtils';

type Ctx2d = CanvasRenderingContext2D;

class PageToImage {
  private page: Page;
  private resultImage: Promise<Image>;
  private background: Promise<HTMLImageElement>;

  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d') as Ctx2d;
  private scale = 0;

  constructor(page: Page) {
    this.page = page;
    this.background = this.loadImage(this.page.image);
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
    switch (action.toolId) {
      case Tools.BEGIN_DRAW_TOOL:
        this.beginDrawing();
        break;

      case Tools.FINISH_DRAW_TOOL:
        this.finishDrawing();
        break;

      default:
        this.drawTool(action);
    }
  }

  private finishDrawing() {
    this.ctx.closePath();
  }

  private beginDrawing() {
    this.ctx.beginPath();
  }

  private drawTool(action: HistoryAction) {
    const { settings, toolId, x, y } = action;
    const tool = Tools.all[toolId];

    tool.setSettings({
      ...settings,
      brushSize: settings.brushSize * this.scale,
    });

    tool.prepareCanvas(this.ctx);

    tool.draw(
      Math.floor(x / action.scale) * this.scale,
      Math.floor(y / action.scale) * this.scale,
      this.ctx
    );
  }

  private async copyCanvasToTemp() {
    const temp = new window.Image();

    temp.src = this.canvas.toDataURL('image/png');
    await temp.decode();

    return temp;
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    Tools.all[0].prepareCanvas(this.ctx);
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

export default async function pagesToImages(pages: Page[], onDone: Callback) {
  Promise.all(
    pages.map((page) => {
      return new PageToImage(page).get;
    })
  )
    .then((imgs) => onDone(imgs.map(PdfUtils.converPxToMM)))
    .catch(() => {});
}
