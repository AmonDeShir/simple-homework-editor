import {
  ToolsActionTypes,
  ToolsStateType,
  EDIT_TOOLS_SETTING,
} from '../types/ToolsTypes';

const initialStateTools: ToolsStateType = {
  selectedToolsId: 0,
  setting: {
    brushColor: '#f3f211',
    brushSize: 20,
    rubberSize: 20,
  },
};

const ToolsReducer = (
  state = initialStateTools,
  action: ToolsActionTypes
): ToolsStateType => {
  switch (action.type) {
    case EDIT_TOOLS_SETTING: {
      return {
        ...state,
        setting: {
          ...state.setting,
          ...action.payload,
        },
      };
    }

    case 'SELECT_TOOL': {
      return {
        ...state,
        selectedToolsId: action.payload,
      };
    }

    default:
      return state;
  }
};

export default ToolsReducer;
