import PageSettings from './PageSettings';
import { ToolsSetting } from './ToolsSetting';

export interface HistoryAction {
  id: number;
  toolId: number;
  settings: ToolsSetting;
  pageSettings: PageSettings;
  x: number;
  y: number;
  step?: string;
}
