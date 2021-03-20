import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toolbox from '../components/toolbox/Toolbox';
import PageSelector from '../components/page-selector/PageSelector';
import GraphicEditor from '../components/graphic-editor/GraphicEditor';
import loadImages from './loadImages';
import { createNewPages } from '../redux/actions/PageActions';
import pagesToPdf from './pagesToPdf';
import { AppState } from '../redux/store';
import './Main.scss';

const Main = () => {
  const dispatch = useDispatch();
  const pages = useSelector((state: AppState) => state.page.pages);

  return (
    <div className="main">
      <Toolbox
        onExportClick={() => {
          pagesToPdf(pages);
        }}
        onOpenClick={() => {
          loadImages((images) => dispatch(createNewPages(images)));
        }}
      />

      <GraphicEditor />
      <PageSelector />
    </div>
  );
};

export default Main;
