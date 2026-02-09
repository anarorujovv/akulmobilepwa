import React from 'react';
import useTheme from '../theme/useTheme';

const Line = ({ width }) => {
  const theme = useTheme();

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        width,
        height: 0.8,
        backgroundColor: theme.whiteGrey
      }} />
    </div>
  );
};

export default Line;