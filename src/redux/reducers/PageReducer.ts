import { HistoryAction } from '../interfaces/HistoryAction';
import { ImagePage } from '../interfaces/Page';
import { PageStateType, PageActionTypes } from '../types/PageActionTypes';

const initialStatePage: PageStateType = {
  page: undefined,
  imagePages: [],
  textPages: [],
  id: -1,
  fileName: '',
};

const PageReducer = (
  state = { ...initialStatePage },
  action: PageActionTypes
): PageStateType => {
  switch (action.type) {
    case 'EDIT_PAGE_SETTINGS': {
      if (!state.page) {
        return state;
      }

      const settings = { ...state.page.settings, ...action.payload };

      const imagePages = state.imagePages.map((page) =>
        page.id !== state.id ? page : { ...page, settings, future: [] }
      );

      const textPages = state.textPages.map((page) =>
        page.id !== state.id ? page : { ...page, settings, future: [] }
      );

      return {
        ...state,
        page: imagePages[state.id],
        textPages,
        imagePages,
      };
    }

    case 'NEW_FILE': {
      return { ...initialStatePage };
    }

    case 'SET_FILE_NAME': {
      return { ...state, fileName: action.payload };
    }

    case 'CREATE_NEW_IMAGE_PAGES': {
      const lastFreeId = Math.max(
        state.imagePages[state.imagePages.length - 1]?.id + 1 || 0,
        state.textPages[state.imagePages.length - 1]?.id + 1 || 0
      );

      const pages = action.payload.map(
        (data, i) =>
          ({
            id: lastFreeId + i,
            data,
            type: 'Image',
            history: new Array<HistoryAction>(),
            settings: { rotation: 0, scale: 1 },
            future: new Array<HistoryAction>(),
          } as ImagePage)
      );

      if (state.imagePages.length === 0) {
        return {
          ...state,
          imagePages: [...pages],
          page: pages[0],
          id: 0,
        };
      }

      return {
        ...state,
        imagePages: [...state.imagePages, ...pages],
      };
    }

    case 'SELECT_PAGE': {
      const id = action.payload;
      const isPageWithThatIdExist =
        id < 0 ||
        id >= state.imagePages.length + state.textPages.length ||
        id === state.id ||
        Number.isNaN(id);

      if (isPageWithThatIdExist) {
        return state;
      }

      const page =
        state.imagePages.filter((imagePage) => id === imagePage.id)[0] ||
        state.textPages.filter((textPage) => id === textPage.id)[0];

      return {
        ...state,
        page,
        id,
      };
    }

    case 'SELECT_NEXT_PAGE': {
      const id = (state.id as number) + 1;
      const isPageWithThatIdExist =
        id < 0 ||
        id >= state.imagePages.length + state.textPages.length ||
        id === state.id ||
        Number.isNaN(id);

      if (isPageWithThatIdExist) {
        return state;
      }

      const page =
        state.imagePages.filter((imagePage) => id === imagePage.id)[0] ||
        state.textPages.filter((textPage) => id === textPage.id)[0];

      return {
        ...state,
        page,
        id,
      };
    }

    case 'SELECT_PREVIOUS_PAGE': {
      const id = (state.id as number) - 1;
      const isPageWithThatIdExist =
        id < 0 ||
        id >= state.imagePages.length + state.textPages.length ||
        id === state.id ||
        Number.isNaN(id);

      if (isPageWithThatIdExist) {
        return state;
      }

      const page =
        state.imagePages.filter((imagePage) => id === imagePage.id)[0] ||
        state.textPages.filter((textPage) => id === textPage.id)[0];

      return {
        ...state,
        page,
        id,
      };
    }

    case 'ADD_HISTORY_ACTIONS': {
      if (state.page?.type !== 'Image') {
        return state;
      }

      const history = [...state.page.history, ...action.payload];
      const imagePages = state.imagePages.map((page) =>
        page.id !== state.id ? page : { ...page, history, future: [] }
      );

      return {
        ...state,
        page: imagePages[state.id],
        imagePages,
      };
    }

    case 'UNDO_HISTORY': {
      if (state.page?.type !== 'Image' || state.page.history.length === 0) {
        return state;
      }

      return {
        ...state,
        imagePages: state.imagePages.map((page) => {
          return page.id !== state.id
            ? page
            : {
                ...page,
                future: [...page.future, page.history.pop() as HistoryAction],
                history: [...page.history],
              };
        }),
      };
    }

    case 'REDO_HISTORY': {
      if (state.page?.type !== 'Image' || state.page.future.length === 0) {
        return state;
      }

      return {
        ...state,
        imagePages: state.imagePages.map((page) => {
          return page.id !== state.id
            ? page
            : {
                ...page,
                history: [...page.history, page.future.pop() as HistoryAction],
                future: [...page.future],
              };
        }),
      };
    }

    default:
      return state;
  }
};

export default PageReducer;
