import React, { useState } from 'react';
import Button from '../button/Button';
import './NumberPicker.scss';

type Props = {
  startValue?: number;
  step?: number;
  onChange?: (value: number) => void;
};

const NumberPicker = ({ startValue, step = 1, onChange }: Props) => {
  const [value, setValue] = useState(startValue ?? 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value) || 0);

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="number-picker">
      <Button onClick={() => setValue((prev) => prev - step)}>{'<'}</Button>
      <input
        value={value}
        type="number"
        name="points"
        step={step ?? 1}
        onChange={handleChange}
      />
      <Button className="right" onClick={() => setValue((prev) => prev + step)}>
        {'>'}
      </Button>
    </div>
  );
};

NumberPicker.defaultProps = {
  startValue: 0,
  step: 1,
  onChange: () => {},
};

export default NumberPicker;
