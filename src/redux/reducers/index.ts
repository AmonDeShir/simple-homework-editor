import { Reducer, combineReducers } from 'redux';
import { PageActionTypes, PageStateType } from '../types/PageActionTypes';
import { ToolsActionTypes, ToolsStateType } from '../types/ToolsTypes';
import PageReducer from './PageReducer';
import ToolsReducer from './ToolsReducer';

type RootReducer = Reducer<
  {
    tools: ToolsStateType;
    page: PageStateType;
  },
  PageActionTypes | ToolsActionTypes
>;

const rootReducer = (combineReducers({
  tools: ToolsReducer,
  page: PageReducer,
}) as unknown) as RootReducer;

export default rootReducer;
