import React from 'react';
import useTheme from '../theme/useTheme';
import useGlobalStore from '../data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';

const DocumentInfo = ({ data }) => {

  let theme = useTheme();
  let permissions = useGlobalStore(state => state.permissions);

  const styles = {
    container: {
      width: '100%',
      height: 70,
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      padding: '5px 0'
    },
    scrollContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 50,
      paddingLeft: 10,
      paddingRight: 10,
      minWidth: '100%',
      alignItems: 'center',
      height: '100%'
    },
    balanceSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      minWidth: 80
    },
    balanceTitle: {
      fontSize: 12,
      color: theme.grey,
      marginBottom: 1,
      margin: 0
    },
    balanceValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.black,
      margin: 0
    },
  };

  const renderItem = (item, index) => {
    switch (item.title) {
      case "Maya":
        return (
          permission_ver(permissions, 'profit', 'D') && (
            <div key={index} style={styles.balanceSection}>
              <span style={styles.balanceTitle}>{item.title}</span>
              <span style={styles.balanceValue}>{item.value}</span>
            </div>
          )
        );
      case "Qazanc":
        return (
          permission_ver(permissions, 'profit', 'D') && (
            <div key={index} style={styles.balanceSection}>
              <span style={styles.balanceTitle}>{item.title}</span>
              <span style={styles.balanceValue}>{item.value}</span>
            </div>
          )
        );
      default:
        return (
          <div key={index} style={styles.balanceSection}>
            <span style={styles.balanceTitle}>{item.title}</span>
            <span style={styles.balanceValue}>{item.value}</span>
          </div>
        );
    }
  };

  return (
    <div style={styles.container} className="hide-scrollbar">
      <div style={styles.scrollContent}>
        {
          data.map((item, index) => {
            return renderItem(item, index);
          })
        }
      </div>
    </div>
  );
};

export default DocumentInfo;
