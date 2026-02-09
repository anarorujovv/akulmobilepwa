import React from 'react';
import useTheme from '../theme/useTheme';

const ManageCard = ({ customPadding, ...props }) => {

  const theme = useTheme();

  const styles = {
    container: {
      width: '100%',
      boxShadow: `0 2px 4px ${theme.black}33`, // 33 for some transparency approximation
      backgroundColor: theme.bg,
      paddingBottom: 50,
      boxSizing: 'border-box',
      ...customPadding,
    },
  };

  return (
    <div style={styles.container}>
      {props.children}
    </div>
  );
};

export default ManageCard;

