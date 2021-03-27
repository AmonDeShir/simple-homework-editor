import fs from 'fs';
import React, { useState } from 'react';
import DrawIf from '../../utilities/DrawIf';
import getFilesPath, { Filters } from '../../utilities/getFilesPath';
import ArrowToggleButton from '../arrow-toggle-button/ArrowToggleButton';
import Button from '../button/Button';
import NumberPicker from '../number-picker/NumberPicker';

import './ResultPanel.scss';

const ResultPanel = () => {
  const [visibility, setIsShowed] = useState('hide');
  const [results, setResults] = useState<string[]>([]);

  const togglePanel = () => {
    setIsShowed((state) => (state === 'show' ? 'hide' : 'show'));
  };

  const loadSettings = () => {
    const dialogSetting = {
      message: 'Wybierz model sprawdzianu',
      buttonLabel: 'Gotowe',
      filters: [Filters.txt],
    };

    getFilesPath(dialogSetting, (files) => {
      if (files.length > 0) {
        const data = fs
          .readFileSync(files[0] ?? '', 'utf-8')
          .split('\n')
          .slice(0, -1);

        setResults(data);
      }
    });
  };

  const resultPanelClassAddition = `
    results-panel--${visibility}
    ${results.length === 0 ? `results-panel--empty` : ''}
  `;

  return (
    <div className={`results-panel ${resultPanelClassAddition}`}>
      <ArrowToggleButton onClick={togglePanel} />
      <DrawIf condition={results.length > 0}>
        <ul>
          {results.map((text) => (
            <li key={text}>
              <p>{text}</p>
              <NumberPicker step={0.5} />
            </li>
          ))}
        </ul>
      </DrawIf>
      <Button className="load" onClick={loadSettings}>
        Wczytaj
      </Button>
    </div>
  );
};

export default ResultPanel;
