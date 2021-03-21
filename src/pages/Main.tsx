import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { createNewPages } from '../redux/actions/PageActions';
import Toolbox from '../components/toolbox/Toolbox';
import PageSelector from '../components/page-selector/PageSelector';
import GraphicEditor from '../components/graphic-editor/GraphicEditor';
import pagesToPdf from '../utilities/convertToPdf';
import loadImages from '../utilities/loadImages';
import getFilesPath, { Filters } from '../utilities/getFilesPath';
import './Main.scss';
import pagesToImages from '../utilities/pagesToImages';

const Main = () => {
  const dispatch = useDispatch();
  const pages = useSelector((state: AppState) => state.page.pages);

  return (
    <div className="main">
      <Toolbox
        onExportClick={() => {
          pagesToImages(pages, (images) => pagesToPdf(images));
        }}
        onOpenClick={() => {
          getFilesPath(
            {
              message: 'Wybierz sprawdzany',
              buttonLabel: 'Gotowe',
              filters: [Filters.images],
              multiselect: true,
            },
            (files) => {
              loadImages(files, (images) => dispatch(createNewPages(images)));
            }
          );
        }}
      />

      <GraphicEditor />
      <PageSelector />
    </div>
  );
};

export default Main;
