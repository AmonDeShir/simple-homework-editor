import { HistoryAction } from './HistoryAction';

export interface Page {
  id: number;
  image: string;
  history: HistoryAction[];
}
