import Brush from './Brush';
import Move from './Move';
import Rotate from './Rotate';
import Rubber from './Rubber';
import Tool from './Tool';

export default class Tools {
  private static TOOLS: Tool[] = [];

  public static init() {
    Tools.TOOLS[Brush.id] = new Brush();
    Tools.TOOLS[Rubber.id] = new Rubber();
    Tools.TOOLS[Move.id] = new Move();
    Tools.TOOLS[Rotate.id] = new Rotate();
  }

  public static get all(): Tool[] {
    return this.TOOLS;
  }
}

Tools.init();
