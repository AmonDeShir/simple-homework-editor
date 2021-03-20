import { HistoryAction } from '../interfaces/HistoryAction';
import { PageStateType, PageActionTypes } from '../types/PageActionTypes';

const initialStatePage: PageStateType = {
  history: [],
  image: '',
  pages: [{ history: [], id: 0, image: '' }],
  id: 0,
};

const PageReducer = (
  state = initialStatePage,
  action: PageActionTypes
): PageStateType => {
  switch (action.type) {
    case 'CREATE_NEW_PAGES': {
      const pages = action.payload.map((image, i) => ({
        id: i,
        image,
        history: new Array<HistoryAction>(),
      }));

      return {
        pages: [...pages],
        history: [...pages[0].history],
        image: `${pages[0].image}`,
        id: 0,
      };
    }

    case 'SELECT_PAGE': {
      const id = action.payload;

      if (
        id < 0 ||
        id >= state.pages.length ||
        id === state.id ||
        Number.isNaN(id)
      ) {
        return state;
      }

      return {
        ...state,
        history: [...state.pages[id].history],
        image: `${state.pages[id].image}`,
        id,
      };
    }

    case 'SELECT_NEXT_PAGE': {
      const id = (state.id as number) + 1;

      if (
        id < 0 ||
        id >= state.pages.length ||
        id === state.id ||
        Number.isNaN(id)
      ) {
        return state;
      }

      return {
        ...state,
        history: [...state.pages[id].history],
        image: `${state.pages[id].image}`,
        id,
      };
    }

    case 'SELECT_PREVIOUS_PAGE': {
      const id = (state.id as number) - 1;

      if (
        id < 0 ||
        id >= state.pages.length ||
        id === state.id ||
        Number.isNaN(id)
      ) {
        return state;
      }

      return {
        ...state,
        history: [...state.pages[id].history],
        image: `${state.pages[id].image}`,
        id,
      };
    }

    case 'ADD_HISTORY_ACTIONS': {
      const history = [...state.history, ...action.payload];
      const pages = state.pages.map((page) =>
        page.id !== state.id ? page : { ...page, history }
      );

      return {
        ...state,
        history,
        pages,
      };
    }

    default:
      return state;
  }
};

export default PageReducer;
