import React from 'react';
import useTheme from '../../shared/theme/useTheme';

const ProductTransactionsManage = () => {
  let theme = useTheme();

  return (
    <div style={{
      flex: 1,
      backgroundColor: theme.whiteGrey,
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <span>ProductTransactionsManage</span>
    </div>
  )
}

export default ProductTransactionsManage;