import Tool, { RendererToolbox } from './Tool';

export default class Rotate extends Tool {
  public static id = 3;

  updateSettings() {}
  prepareCanvas() {}

  onMouseMove(): void {}
  onMouseUp(): void {}
  onMouseEnter(): void {}
  onMouseLeave(): void {}
  historyAction(): void {}

  onMouseDown({ page, updateGlobalSettings }: RendererToolbox): void {
    const { rotation } = page.settings;
    const newRotation = rotation === 360 ? 0 : rotation + 90;

    updateGlobalSettings({ rotation: newRotation });
  }
}
