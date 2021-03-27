import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import Toolbox from '../components/toolbox/Toolbox';
import PageSelector from '../components/page-selector/PageSelector';
import GraphicEditor from '../components/graphic-editor/GraphicEditor';
import ResultPanel from '../components/result-panel/ResultPanel';
import pagesToPdf from '../utilities/convertToPdf';
import loadImages from '../utilities/loadImages';
import getFilesPath, { Filters } from '../utilities/getFilesPath';
import pagesToImages from '../utilities/pagesToImages';
import TextboxMessageBox from '../components/message-box/textbox-message-box/TextboxMessageBox';
import YesNoMessageBox from '../components/message-box/yes-no-message-box/YesNoMessageBox';
import DrawIf from '../utilities/DrawIf';
import './Main.scss';
import {
  createNewImagePages,
  newFile,
  setFileName,
} from '../redux/actions/PageActions';

const Main = () => {
  const dispatch = useDispatch();
  const imagePages = useSelector((state: AppState) => state.page.imagePages);
  const fileName = useSelector((state: AppState) => state.page.fileName);

  const [
    drawNewFileConfirmationMessage,
    setDrawNewFileConfirmationMessage,
  ] = useState(false);

  const drawGraphicEditor =
    useSelector((state: AppState) => {
      return state.page.page && state.page.page.type === 'Image';
    }) ?? false;

  const drawPageSelector =
    useSelector((state: AppState) => {
      return (
        state.page.imagePages.length > 0 || state.page.textPages.length > 0
      );
    }) ?? false;

  const drawSetFileNameMessage =
    useSelector((state: AppState) => {
      return state.page.fileName.length === 0;
    }) ?? false;

  const createNewFile = () => {
    setDrawNewFileConfirmationMessage(false);
    dispatch(newFile());
  };

  const setNewFileName = (name: string) => {
    dispatch(setFileName(name));
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="main">
      <Toolbox
        onExportClick={() => {
          pagesToImages(imagePages, (images) => pagesToPdf(images, fileName));
        }}
        onOpenClick={() => {
          getFilesPath(
            {
              message: 'Wybierz sprawdzany',
              buttonLabel: 'Gotowe',
              filters: [Filters.images],
              multiSelections: true,
            },
            (files) => {
              loadImages(files, (images) => {
                dispatch(createNewImagePages(images));
              });
            }
          );
        }}
        onNewFileClick={() => {
          setDrawNewFileConfirmationMessage(true);
        }}
      />
      <DrawIf condition={drawGraphicEditor}>
        <GraphicEditor />
      </DrawIf>

      <DrawIf condition={drawPageSelector}>
        <PageSelector />
      </DrawIf>

      <DrawIf condition={drawNewFileConfirmationMessage}>
        <YesNoMessageBox
          onNoClick={() => setDrawNewFileConfirmationMessage(false)}
          onYesClick={createNewFile}
        >
          Czy chcesz utworzyć nowy plik?
        </YesNoMessageBox>
      </DrawIf>

      <DrawIf condition={drawSetFileNameMessage}>
        <TextboxMessageBox buttonLabel="Gotowe" onClick={setNewFileName}>
          Wprowadź nazwe nowego plik
        </TextboxMessageBox>
      </DrawIf>
      <ResultPanel />
    </div>
  );
};

export default Main;
