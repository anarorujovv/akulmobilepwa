import React from 'react';
import useTheme from '../theme/useTheme';

const DocumentPayment = () => {

  let theme = useTheme();

  return (
    <div style={{
      flex: 1,
      backgroundColor: theme.primary,
      width: '100%',
      minHeight: 50 // Added minHeight for visibility
    }}>

    </div>
  )
}

export default DocumentPayment
