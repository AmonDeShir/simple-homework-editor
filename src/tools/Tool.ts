import { ImagePage, TextPage } from '../redux/interfaces/Page';
import PageSettings from '../redux/interfaces/PageSettings';
import { ToolsSetting } from '../redux/interfaces/ToolsSetting';
import { HistoryAction } from '../redux/interfaces/HistoryAction';

export type Ctx2d = CanvasRenderingContext2D;
export type Canvas = HTMLCanvasElement;

export type RendererToolbox = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  posX: number;
  posY: number;
  setting: ToolsSetting;
  page: TextPage | ImagePage;
  noteInHistory: (step?: string) => void;
  updateGlobalSettings: (settings: Partial<PageSettings>) => void;
};

export type HistoricalToolbox = {
  ctx: CanvasRenderingContext2D;
  history: HistoryAction;
  actualPageSettings: PageSettings;
  step?: string;
};

export default abstract class Tool {
  public static id = 0;

  abstract prepareCanvas(toolbox: RendererToolbox): void;
  abstract updateSettings(toolbox: RendererToolbox): void;

  abstract onMouseMove(toolbox: RendererToolbox): void;
  abstract onMouseDown(toolbox: RendererToolbox): void;
  abstract onMouseUp(toolbox: RendererToolbox): void;
  abstract onMouseEnter(toolbox: RendererToolbox): void;
  abstract onMouseLeave(toolbox: RendererToolbox): void;

  abstract historyAction(toolbox: HistoricalToolbox): void;

  public static getRendererToolbox(toolbox: HistoricalToolbox) {
    return {
      ctx: toolbox.ctx,
      canvas: toolbox.ctx.canvas,
      image: document.createElement('img'),
      posX: toolbox.history.x,
      posY: toolbox.history.y,
      setting: toolbox.history.settings,
      page: {
        data: '',
        future: [],
        history: [toolbox.history],
        id: toolbox.history.id,
        settings: toolbox.history.pageSettings,
        type: 'Image',
      } as ImagePage,
      noteInHistory: () => {},
      updateGlobalSettings: () => {},
    };
  }
}
