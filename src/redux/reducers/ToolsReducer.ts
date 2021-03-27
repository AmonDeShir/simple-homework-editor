import {
  ToolsActionTypes,
  ToolsStateType,
  EDIT_TOOLS_SETTING,
} from '../types/ToolsTypes';

const initialStateTools: ToolsStateType = {
  selectedToolId: 0,
  setting: {
    brushColor: '#ff0000',
    brushSize: 5,
    rubberSize: 70,
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
        selectedToolId: action.payload,
      };
    }

    default:
      return state;
  }
};

export default ToolsReducer;
