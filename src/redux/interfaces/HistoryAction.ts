import { ToolsSetting } from './ToolsSetting';

export interface HistoryAction {
  id: number;
  toolId: number;
  settings: ToolsSetting;
  x: number;
  y: number;
  scale: number;
}
