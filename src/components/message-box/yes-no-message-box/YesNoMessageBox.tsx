import React from 'react';
import Button from '../../button/Button';
import './YesNoMessageBox.scss';

type Props = React.PropsWithChildren<{
  onYesClick?: () => void;
  onNoClick?: () => void;
}>;

const defaultCallback = () => {};

const YesNoMessageBox = ({ children, onYesClick, onNoClick }: Props) => {
  return (
    <div className="yes-no-message-box">
      <div className="yes-no-message-box__container">
        <p>{children}</p>
        <div className="yes-no-messagebox__container__center-buttons">
          <Button onClick={() => (onYesClick || defaultCallback)()}>Tak</Button>
          <Button onClick={() => (onNoClick || defaultCallback)()}>Nie</Button>
        </div>
      </div>
    </div>
  );
};

export default YesNoMessageBox;
