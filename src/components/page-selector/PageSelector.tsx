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
  const pages = useSelector((state: AppState) => state.page.pages);
  const selectedPage = useSelector((state: AppState) => state.page.id);

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

      {pages.map(({ id }) => (
        <input
          className={isSelected(id)}
          key={id}
          type="button"
          value={id + 1}
          onClick={() => dispatch(selectPage(id))}
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
