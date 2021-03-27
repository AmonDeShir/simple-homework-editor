import Tool, { HistoricalToolbox, RendererToolbox } from './Tool';

export default class Brush extends Tool {
  public static id = 0;
  private canDraw = false;
  #settings = {
    color: '#ffffff',
    size: 1,
  };

  get settings() {
    return this.#settings;
  }

  updateSettings = ({ setting }: RendererToolbox) => {
    const { brushColor, brushSize } = setting;

    this.#settings = {
      size: brushSize,
      color: brushColor,
    };
  };

  prepareCanvas = ({ ctx, page }: RendererToolbox) => {
    if (ctx.globalCompositeOperation !== 'source-over')
      ctx.globalCompositeOperation = 'source-over';

    if (ctx.strokeStyle !== this.#settings.color)
      ctx.strokeStyle = this.#settings.color;

    if (ctx.lineWidth !== this.#settings.size * page.settings.scale)
      ctx.lineWidth = this.#settings.size * page.settings.scale;

    if (ctx.lineJoin !== 'round') {
      ctx.lineJoin = 'round';
    }

    if (ctx.lineCap !== 'round') {
      ctx.lineCap = 'round';
    }
  };

  onMouseDown = ({ ctx, noteInHistory }: RendererToolbox) => {
    this.canDraw = true;
    ctx.beginPath();
    noteInHistory('begin');
  };

  onMouseUp = ({ ctx, noteInHistory }: RendererToolbox) => {
    this.canDraw = false;
    ctx.closePath();
    noteInHistory('close');
  };

  onMouseEnter = ({ ctx, noteInHistory }: RendererToolbox) => {
    if (this.canDraw) {
      ctx.beginPath();
      noteInHistory('begin');
    }
  };

  onMouseLeave = ({ ctx, noteInHistory }: RendererToolbox) => {
    if (this.canDraw) {
      ctx.closePath();
      noteInHistory('close');
    }
  };

  onMouseMove = (toolbox: RendererToolbox) => {
    const { ctx, noteInHistory } = toolbox;
    const { posX, posY } = toolbox;

    if (this.canDraw) {
      this.updateSettings(toolbox);
      this.prepareCanvas(toolbox);
      ctx.lineTo(posX, posY);
      ctx.stroke();

      noteInHistory();
    }
  };

  historyAction = (toolbox: HistoricalToolbox) => {
    const { ctx, history, actualPageSettings, step } = toolbox;
    const historicalScale = history.pageSettings.scale;

    const [x, y] = [
      (toolbox.history.x / historicalScale) * actualPageSettings.scale,
      (toolbox.history.y / historicalScale) * actualPageSettings.scale,
    ];

    switch (step) {
      case 'begin':
        ctx.beginPath();
        break;

      case 'close':
        ctx.closePath();
        break;

      default:
        this.updateSettings(Tool.getRendererToolbox(toolbox));
        this.prepareCanvas(Tool.getRendererToolbox(toolbox));
        ctx.lineTo(x, y);
        ctx.stroke();
    }
  };
}
