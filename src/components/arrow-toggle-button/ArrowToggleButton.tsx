import React, { useState } from 'react';
import './ArrowToggleButton.scss';

type Props = {
  startValue?: boolean;
  onClick: (value: boolean) => void;
};

const ArrowToggleButton = ({ onClick, startValue = false }: Props) => {
  const [value, setValue] = useState(startValue);
  const toggle = () => setValue((prev) => !prev);

  const handleOnClick = () => {
    toggle();
    onClick(value);
  };

  return (
    <button
      type="button"
      className={`arrow-toggle-btn arrow-toggle-btn--${value}`}
      onClick={handleOnClick}
    >
      {'>'}
    </button>
  );
};

ArrowToggleButton.defaultProps = {
  startValue: false,
};

export default ArrowToggleButton;
