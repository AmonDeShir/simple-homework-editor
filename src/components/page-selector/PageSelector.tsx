import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import './PageSelector.scss';
import {
  selectNextPage,
  selectPage,
  selectPreviousPage,
} from '../../redux/actions/PageActions';

const PageSelector: React.FC = () => {
  const dispatch = useDispatch();
  const selectedPage = useSelector((state: AppState) => state.page.id);

  const pages = useSelector((state: AppState) => {
    return state.page.imagePages.length + state.page.textPages.length;
  });

  const isSelected = (id: number) => {
    return selectedPage === id ? 'page-selector__button--selected' : '';
  };

  return (
    <div className="page-selector">
      <input
        type="button"
        value="<"
        onClick={() => dispatch(selectPreviousPage())}
      />

      {Array.from(Array(pages).keys()).map((i) => (
        <input
          className={isSelected(i)}
          key={i}
          type="button"
          value={i + 1}
          onClick={() => dispatch(selectPage(i))}
        />
      ))}

      <input
        type="button"
        value=">"
        onClick={() => dispatch(selectNextPage())}
      />
    </div>
  );
};

export default PageSelector;
