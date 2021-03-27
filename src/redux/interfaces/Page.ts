import { HistoryAction } from './HistoryAction';
import PageSettings from './PageSettings';

export interface ImagePage {
  id: number;
  data: string;
  settings: PageSettings;
  history: HistoryAction[];
  future: HistoryAction[];
  type: 'Image';
}

export interface TextPage {
  id: number;
  data: Buffer;
  settings: PageSettings;
  type: 'Text';
}

export type PageTypes = 'Image' | 'Text';
