import React from 'react';
import './ToolOptionRange.scss';

type Props = {
  onChange: (value: number) => void;
  value: number;
  text: string;
};

// eslint-disable-next-line prettier/prettier
const ToolOptionRange: React.FC<Props> = ({ text, value, onChange }: Props) => {
  return (
    <div className="tool-option--range">
      <label htmlFor="size">
        {text}

        <output className="price-output" htmlFor="size">
          {`:\u00A0${value}`}
        </output>

        <input
          type="range"
          id="size"
          min="1"
          max="100"
          step="1"
          value={value}
          onChange={({ target }) => onChange(Number(target.value))}
        />
      </label>
    </div>
  );
};

export default ToolOptionRange;
