import { Ctx2d } from '../tools/Tool';

function mousePositionToCanvasPosition(
  ctx: Ctx2d,
  event: React.MouseEvent,
  rotation: number
) {
  const rect = ctx.canvas.getBoundingClientRect();

  switch (rotation) {
    case 90:
      return {
        x: Math.floor(event.pageY - rect.top),
        y: Math.floor(Math.abs(event.pageX - rect.right)),
      };

    case 180:
      return {
        x: Math.floor(Math.abs(event.pageX - rect.right)),
        y: Math.floor(Math.abs(event.pageY - rect.bottom)),
      };

    case 270:
      return {
        x: Math.floor(Math.abs(event.pageY - rect.bottom)),
        y: Math.floor(event.pageX - rect.left),
      };

    default:
      return {
        x: Math.floor(event.pageX - rect.left),
        y: Math.floor(event.pageY - rect.top),
      };
  }
}

export default mousePositionToCanvasPosition;
