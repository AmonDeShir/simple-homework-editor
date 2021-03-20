import { HistoryAction } from '../interfaces/HistoryAction';
import { Page } from '../interfaces/Page';

export const CREATE_NEW_PAGES = 'CREATE_NEW_PAGES';
export const SELECT_PAGE = 'SELECT_PAGE';
export const SELECT_NEXT_PAGE = 'SELECT_NEXT_PAGE';
export const SELECT_PREVIOUS_PAGE = 'SELECT_PREVIOUS_PAGE';
export const ADD_HISTORY_ACTIONS = 'ADD_HISTORY_ACTIONS';

export interface PageStateType {
  history: HistoryAction[];
  image: string;
  pages: Page[];
  id: number;
}

export interface CreateNewPageActionType {
  type: typeof CREATE_NEW_PAGES;
  payload: string[];
}

export interface SelectPageActionType {
  type: typeof SELECT_PAGE;
  payload: number;
}

export interface SelectNextPageActionType {
  type: typeof SELECT_NEXT_PAGE;
}

export interface SelectPreviousPageActionType {
  type: typeof SELECT_PREVIOUS_PAGE;
}

export interface AddHistoryActionActionType {
  type: typeof ADD_HISTORY_ACTIONS;
  payload: HistoryAction[];
}

export type PageActionTypes =
  | CreateNewPageActionType
  | SelectPageActionType
  | SelectNextPageActionType
  | SelectPreviousPageActionType
  | AddHistoryActionActionType;
