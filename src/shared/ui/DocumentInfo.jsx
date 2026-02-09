import React from 'react';
import useGlobalStore from '../data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';

const DocumentInfo = ({ data }) => {
  let permissions = useGlobalStore(state => state.permissions);

  const styles = {
    container: {
      width: '100%',
      backgroundColor: 'var(--adm-color-background)',
      borderBottom: '1px solid var(--adm-color-border)',
      padding: '12px 0',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    },
    scrollContent: {
      display: 'inline-flex', // Changed to inline-flex for horizontal scroll
      flexDirection: 'row',
      alignItems: 'center',
      padding: '0 16px',
      gap: 24,
      minWidth: '100%'
    },
    balanceSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    balanceTitle: {
      fontSize: 12,
      color: 'var(--adm-color-weak)',
      marginBottom: 4,
      margin: 0
    },
    balanceValue: {
      fontSize: 16,
      fontWeight: '600',
      color: 'var(--adm-color-text)',
      margin: 0
    }
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
        {data.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
};

export default DocumentInfo;
