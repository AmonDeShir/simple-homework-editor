import React from 'react';
import './Button.scss';

type Props = JSX.ElementChildrenAttribute & {
  onClick?: () => void;
  className?: string | undefined;
};

const Button = ({ children, className, onClick }: Props) => (
  <input
    className={`button ${className ? `button--${className}` : ''}`}
    type="button"
    value={`${children}`}
    onClick={onClick}
  />
);

Button.defaultProps = {
  onClick: () => {},
  className: undefined,
};

export default Button;
