import React from 'react';

type Props = React.PropsWithChildren<{
  condition: boolean;
}>;

const DrawIf = ({ children, condition }: Props) => {
  if (condition) return <>{children}</>;
  return <></>;
};

export default DrawIf;
