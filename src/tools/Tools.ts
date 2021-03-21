import Brush from './Brush';
import Rubber from './Rubber';
import Tool from './Tool';

export default class Tools {
  private static readonly TOOLS = [new Brush(), new Rubber()];
  public static readonly FINISH_DRAW_TOOL = -1;
  public static readonly BEGIN_DRAW_TOOL = -2;

  public static get all(): Tool[] {
    return this.TOOLS;
  }
}
