import React, { useState } from 'react';
import Button from '../../button/Button';
import './TextboxMessageBox.scss';

type Props = React.PropsWithChildren<{
  onClick: (value: string) => void;
  buttonLabel: string;
}>;

const TextboxMessageBox = ({ children, buttonLabel, onClick }: Props) => {
  const [value, setValue] = useState('');

  return (
    <div className="textbox-message-box">
      <div className="textbox-message-box__container">
        <p>{children}</p>
        <input type="text" onChange={(e) => setValue(e.target.value)} />
        <Button onClick={() => onClick(value)}>{buttonLabel}</Button>
      </div>
    </div>
  );
};

export default TextboxMessageBox;
