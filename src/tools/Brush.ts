import { ToolsSetting } from '../redux/interfaces/ToolsSetting';
import Tool from './Tool';

export default class Brush extends Tool {
  private settings = {
    color: '#ffffff',
    size: 1,
  };

  setSettings({ brushColor, brushSize }: ToolsSetting) {
    this.settings = {
      size: brushSize,
      color: brushColor,
    };
  }

  prepareCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = this.settings.color;
    ctx.lineWidth = this.settings.size;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }
}
