import Brush from './Brush';
import { RendererToolbox } from './Tool';

export default class Rubber extends Brush {
  public static id = 1;

  #settings = {
    size: 1,
  };

  get settings() {
    return { ...this.#settings, color: '' };
  }

  updateSettings = ({ setting }: RendererToolbox) => {
    this.#settings = {
      size: setting.rubberSize,
    };
  };

  prepareCanvas = ({ ctx, page }: RendererToolbox) => {
    if (ctx.globalCompositeOperation !== 'destination-out')
      ctx.globalCompositeOperation = 'destination-out';

    if (ctx.lineWidth !== this.#settings.size * page.settings.scale)
      ctx.lineWidth = this.#settings.size * page.settings.scale;

    if (ctx.lineJoin !== 'round') {
      ctx.lineJoin = 'round';
    }

    if (ctx.lineCap !== 'round') {
      ctx.lineCap = 'round';
    }
  };
}
