import React from 'react';
import './Button.scss';

type Props = JSX.ElementChildrenAttribute & {
  onClick?: () => void;
};

const Button: React.FC<Props> = ({ children, onClick }: Props) => (
  <input
    className="button"
    type="button"
    value={`${children}`}
    onClick={onClick}
  />
);

Button.defaultProps = {
  onClick: () => {},
};

export default Button;
