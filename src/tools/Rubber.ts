import { ToolsSetting } from '../redux/interfaces/ToolsSetting';
import Tool from './Tool';

export default class Rubber extends Tool {
  private settings = {
    size: 1,
  };

  setSettings({ rubberSize }: ToolsSetting) {
    this.settings = {
      size: rubberSize,
    };
  }

  prepareCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = this.settings.size;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }
}
