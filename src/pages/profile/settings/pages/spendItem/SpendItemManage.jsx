import React from 'react';
import useTheme from '../../../../../shared/theme/useTheme';

const SpendItemManage = () => {
  const theme = useTheme();

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      minHeight: '100vh'
    }
  };

  return (
    <div style={styles.container}>
      {/* Placeholder for manage functionality if needed outside of modal */}
    </div>
  );
};

export default SpendItemManage;
