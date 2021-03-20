import React from 'react';
import './ToolOptionColor.scss';

type Props = {
  onChange: (value: string) => void;
  value: string;
  text: string;
};

// eslint-disable-next-line prettier/prettier
const ToolOptionColor: React.FC<Props> = ({value, text, onChange }: Props) => (
  <div className="tool-option--color">
    <label htmlFor="color">
      {text}
      <br />
      <input
        type="color"
        id="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  </div>
);

export default ToolOptionColor;
