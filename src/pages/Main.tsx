import React from 'react';
import { useDispatch } from 'react-redux';
import Toolbox from '../components/toolbox/Toolbox';
import PageSelector from '../components/page-selector/PageSelector';
import GraphicEditor from '../components/graphic-editor/GraphicEditor';
import loadImages from './loadImages';
import { createNewPages } from '../redux/actions/PageActions';
import './Main.scss';

const Main = () => {
  const dispatch = useDispatch();

  return (
    <div className="main">
      <Toolbox
        onExportClick={() => {}}
        onOpenClick={() =>
          loadImages((images) => dispatch(createNewPages(images)))
        }
      />

      <GraphicEditor />
      <PageSelector />
    </div>
  );
};

export default Main;
