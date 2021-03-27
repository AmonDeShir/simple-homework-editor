import { HistoryAction } from '../interfaces/HistoryAction';
import { ImagePage, TextPage } from '../interfaces/Page';
import PageSettings from '../interfaces/PageSettings';

export const EDIT_PAGE_SETTINGS = 'EDIT_PAGE_SETTINGS';
export const NEW_FILE = 'NEW_FILE';
export const SET_FILE_NAME = 'SET_FILE_NAME';
export const CREATE_NEW_IMAGE_PAGES = 'CREATE_NEW_IMAGE_PAGES';
export const CREATE_NEW_TEXT_PAGES = 'CREATE_NEW_TEXT_PAGES';
export const SELECT_PAGE = 'SELECT_PAGE';
export const SELECT_NEXT_PAGE = 'SELECT_NEXT_PAGE';
export const SELECT_PREVIOUS_PAGE = 'SELECT_PREVIOUS_PAGE';
export const ADD_HISTORY_ACTIONS = 'ADD_HISTORY_ACTIONS';
export const UNDO_HISTORY = 'UNDO_HISTORY';
export const REDO_HISTORY = 'REDO_HISTORY';

export interface PageStateType {
  imagePages: ImagePage[];
  textPages: TextPage[];
  page?: ImagePage | TextPage;
  id: number;
  fileName: string;
}

export interface EditPageSettingsActionType {
  type: typeof EDIT_PAGE_SETTINGS;
  payload: Partial<PageSettings>;
}

export interface NewFileActionType {
  type: typeof NEW_FILE;
}

export interface SetFileNameActionType {
  type: typeof SET_FILE_NAME;
  payload: string;
}

export interface CreateNewImagePagesActionType {
  type: typeof CREATE_NEW_IMAGE_PAGES;
  payload: string[];
}

export interface CreateNewTextPagesActionType {
  type: typeof CREATE_NEW_TEXT_PAGES;
  payload: Buffer[];
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

export interface UndoHistoryActionType {
  type: typeof UNDO_HISTORY;
}

export interface RedoHistoryActionType {
  type: typeof REDO_HISTORY;
}

export type PageActionTypes =
  | CreateNewImagePagesActionType
  | CreateNewTextPagesActionType
  | SelectPageActionType
  | SelectNextPageActionType
  | SelectPreviousPageActionType
  | AddHistoryActionActionType
  | UndoHistoryActionType
  | RedoHistoryActionType
  | SetFileNameActionType
  | NewFileActionType
  | EditPageSettingsActionType;
