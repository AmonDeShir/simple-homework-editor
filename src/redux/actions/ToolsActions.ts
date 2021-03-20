import { ToolsSetting } from '../interfaces/ToolsSetting';
import { ToolsActionTypes } from '../types/ToolsTypes';

export const editToolsSettingAction = (
  settings: Partial<ToolsSetting>
): ToolsActionTypes => {
  return {
    type: 'EDIT_TOOLS_SETTING',
    payload: settings,
  };
};

export const selectToolAction = (toolId: number): ToolsActionTypes => {
  return {
    type: 'SELECT_TOOL',
    payload: toolId,
  };
};
