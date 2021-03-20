import { ToolsSetting } from '../interfaces/ToolsSetting';

export const EDIT_TOOLS_SETTING = 'EDIT_TOOLS_SETTING';
export const SELECT_TOOL = 'SELECT_TOOL';

export type ToolsStateType = {
  setting: ToolsSetting;
  selectedToolsId: number;
};

export interface EditToolsActionType {
  type: typeof EDIT_TOOLS_SETTING;
  payload: Partial<ToolsSetting>;
}

export interface SelectTool {
  type: typeof SELECT_TOOL;
  payload: number;
}

export type ToolsActionTypes = EditToolsActionType | SelectTool;
