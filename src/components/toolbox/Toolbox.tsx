import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../button/Button';
import ToolButton from '../tool-button/ToolButton';
import ToolOptionRange from '../tool-option-range/ToolOptionRange';
import ToolOptionColor from '../tool-option-color/ToolOptionColor';
import { AppState } from '../../redux/store';
import { ToolsSetting } from '../../redux/interfaces/ToolsSetting';
import Brush from '../../tools/Brush';
import Rubber from '../../tools/Rubber';
import Move from '../../tools/Move';
import Rotate from '../../tools/Rotate';
import penIcon from '../../assets/pen.svg';
import rubberIcon from '../../assets/rubber.svg';
import handIcon from '../../assets/hand.svg';
import arrowIcon from '../../assets/arrow.svg';
import './Toolbox.scss';
import {
  editToolsSettingAction,
  selectToolAction,
} from '../../redux/actions/ToolsActions';

type Props = {
  onOpenClick: () => void;
  onExportClick: () => void;
  onNewFileClick: () => void;
};

const Toolbox: React.FC<Props> = ({
  onOpenClick,
  onExportClick,
  onNewFileClick,
}: Props) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: AppState) => state.tools.setting);
  const selectedTool = useSelector(
    (state: AppState) => state.tools.selectedToolId
  );

  const handleSettingChange = (value: any, key: keyof ToolsSetting) => {
    const newSettings: Partial<ToolsSetting> = {};
    newSettings[key] = value;

    dispatch(editToolsSettingAction(newSettings));
  };

  return (
    <div className="toolbox">
      <div className="toolbox__file-operations">
        <Button onClick={onExportClick}>Zapisz PDF</Button>
        <Button onClick={onOpenClick}>Dodaj Strony</Button>
        <Button onClick={onNewFileClick}>Nowy Plik</Button>
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
          onClick={() => dispatch(selectToolAction(Brush.id))}
          selected={selectedTool === Brush.id}
        />

        <ToolButton
          icon={rubberIcon}
          onClick={() => dispatch(selectToolAction(Rubber.id))}
          selected={selectedTool === Rubber.id}
        />

        <ToolButton
          icon={handIcon}
          onClick={() => dispatch(selectToolAction(Move.id))}
          selected={selectedTool === Move.id}
        />

        <ToolButton
          icon={arrowIcon}
          onClick={() => dispatch(selectToolAction(Rotate.id))}
          selected={selectedTool === Rotate.id}
        />
      </div>
    </div>
  );
};

export default Toolbox;
