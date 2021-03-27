import { HistoryAction } from '../interfaces/HistoryAction';
import PageSettings from '../interfaces/PageSettings';
import { PageActionTypes } from '../types/PageActionTypes';

export const editPageSettings = (
  settings: Partial<PageSettings>
): PageActionTypes => {
  return {
    type: 'EDIT_PAGE_SETTINGS',
    payload: settings,
  };
};

export const newFile = (): PageActionTypes => {
  return {
    type: 'NEW_FILE',
  };
};

export const setFileName = (name: string): PageActionTypes => {
  return {
    type: 'SET_FILE_NAME',
    payload: name,
  };
};

export const createNewImagePages = (data: string[]): PageActionTypes => {
  return {
    type: 'CREATE_NEW_IMAGE_PAGES',
    payload: data,
  };
};

export const createNewTextPages = (data: Buffer[]): PageActionTypes => {
  return {
    type: 'CREATE_NEW_TEXT_PAGES',
    payload: data,
  };
};

export const selectNextPage = (): PageActionTypes => {
  return {
    type: 'SELECT_NEXT_PAGE',
  };
};

export const selectPreviousPage = (): PageActionTypes => {
  return {
    type: 'SELECT_PREVIOUS_PAGE',
  };
};

export const selectPage = (id: number): PageActionTypes => {
  return {
    type: 'SELECT_PAGE',
    payload: id,
  };
};

export const addHistoryActions = (
  actions: HistoryAction[]
): PageActionTypes => {
  return {
    type: 'ADD_HISTORY_ACTIONS',
    payload: actions,
  };
};

export const undoHistory = (): PageActionTypes => {
  return {
    type: 'UNDO_HISTORY',
  };
};

export const redoHistory = (): PageActionTypes => {
  return {
    type: 'REDO_HISTORY',
  };
};
