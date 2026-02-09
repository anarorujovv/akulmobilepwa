import React from 'react';
import useTheme from '../theme/useTheme';

const NoData = () => {
  const theme = useTheme();

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.bg,
      minHeight: 200
    },
    text: {
      fontSize: 15,
      color: theme.black,
      fontWeight: 'bold',
      marginTop: 10
    }
  };

  return (
    <div style={styles.container}>
      <span style={styles.text}>Məlumat tapılmadı!</span>
    </div>
  );
};

export default NoData;
