import { HistoryAction } from '../interfaces/HistoryAction';
import { PageActionTypes } from '../types/PageActionTypes';

export const createNewPages = (images: string[]): PageActionTypes => {
  return {
    type: 'CREATE_NEW_PAGES',
    payload: images,
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
