import React from 'react';
import './ToolButton.scss';

type Props = {
  icon: string;
  selected?: boolean;
  onClick?: () => void;
};

const ToolButton: React.FC<Props> = ({ icon, selected, onClick }: Props) => (
  <input
    className={`tool-button ${selected ? 'tool-button--selected' : ''}`}
    style={{ backgroundImage: `url( ${icon} )` }}
    type="button"
    onClick={onClick}
  />
);

ToolButton.defaultProps = {
  selected: false,
  onClick: () => {},
};

export default ToolButton;
