import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../button/Button';
import ToolButton from '../tool-button/ToolButton';
import penIcon from '../../assets/pen.svg';
import rubberIcon from '../../assets/rubber.svg';
import ToolOptionRange from '../tool-option-range/ToolOptionRange';
import ToolOptionColor from '../tool-option-color/ToolOptionColor';
import { AppState } from '../../redux/store';
import { ToolsSetting } from '../../redux/interfaces/ToolsSetting';
import './Toolbox.scss';
import {
  editToolsSettingAction,
  selectToolAction,
} from '../../redux/actions/ToolsActions';

type Props = {
  onOpenClick: () => void;
  onExportClick: () => void;
};

const Toolbox: React.FC<Props> = ({ onOpenClick, onExportClick }: Props) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: AppState) => state.tools.setting);
  const selectedTool = useSelector(
    (state: AppState) => state.tools.selectedToolsId
  );

  const handleSettingChange = (value: any, key: keyof ToolsSetting) => {
    const newSettings: Partial<ToolsSetting> = {};
    newSettings[key] = value;

    dispatch(editToolsSettingAction(newSettings));
  };

  return (
    <div className="toolbox">
      <div className="toolbox__file-operations">
        <Button onClick={onExportClick}>Export</Button>
        <Button onClick={onOpenClick}>Open</Button>
        {`${settings.brushColor}, \n ${settings.brushSize}, \n ${settings.rubberSize}`}
      </div>

      <div className="toolbox__tool-settings">
        <ToolOptionRange
          text={`Wielkość \n pędzla`}
          value={settings.brushSize}
          onChange={(v) => handleSettingChange(v, 'brushSize')}
        />

        <ToolOptionRange
          text={`Wielkość \n gumki`}
          value={settings.rubberSize}
          onChange={(v) => handleSettingChange(v, 'rubberSize')}
        />

        <ToolOptionColor
          text="Kolor pędzla"
          value={settings.brushColor}
          onChange={(v) => handleSettingChange(v, 'brushColor')}
        />
      </div>

      <div className="toolbox__tool-selection">
        <ToolButton
          icon={penIcon}
          onClick={() => dispatch(selectToolAction(0))}
          selected={selectedTool === 0}
        />

        <ToolButton
          icon={rubberIcon}
          onClick={() => dispatch(selectToolAction(1))}
          selected={selectedTool === 1}
        />
      </div>
    </div>
  );
};

export default Toolbox;
