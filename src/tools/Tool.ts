import { ToolsSetting } from '../redux/interfaces/ToolsSetting';

export default abstract class Tool {
  abstract prepareCanvas(ctx: CanvasRenderingContext2D): void;

  abstract setSettings(settings: ToolsSetting): void;

  draw(posX: number, posY: number, ctx: CanvasRenderingContext2D): void {
    ctx.lineTo(posX, posY);
    ctx.stroke();
  }

  finishDrawing(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
  }

  beginDrawing(ctx: CanvasRenderingContext2D) {
    ctx.closePath();
    ctx.stroke();
  }
}
