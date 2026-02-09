import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import CardItem from '../../shared/ui/list/CardItem';
import { useLocation } from 'react-router-dom';

const ShiftManage = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Get ID from router state
  let theme = useTheme();

  const [shift, setShift] = useState(null);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.bg,
      // padding: 16,
      overflowY: 'auto'
    },
    headerContainer: {
      padding: 16,
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text, // Assuming theme has text color
    },
    value: {
      fontSize: 14,
      color: theme.text,
    },
    statusOpen: {
      color: theme.green,
      fontWeight: 'bold',
    },
    statusClosed: {
      color: theme.red,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 10,
      paddingLeft: 16
    }
  };

  const fetchingData = async () => {
    let obj = {
      id: id,
      token: await AsyncStorageWrapper.getItem('token')
    };
    await api('shifts/get.php', obj)
      .then(element => {
        if (element != null && element.List && element.List.length > 0) {
          setShift(element.List[0]);
        } else {
          // Handle case where specific shift fetch might fail or return emptiness differently? 
          // API usually returns List[0] for single get if designed that way.
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  useEffect(() => {
    if (id) {
      fetchingData();
    }
  }, [id]);

  if (!shift) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <div style={styles.row}>
          <span style={styles.label}>Satış nöqtəsi:</span>
          <span style={styles.value}>{shift.SalePointName}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Kassa nömrəsi:</span>
          <span style={styles.value}>{shift.RegisterId}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Açılıb:</span>
          <span style={styles.value}>{shift.OpenMoment}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Növbəni açıb:</span>
          <span style={styles.value}>{shift.OpenOwnerName}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Bağlanıb:</span>
          <span style={styles.value}>
            {shift.CloseMoment == null ? (
              <span style={styles.statusOpen}>Açıqdır</span>
            ) : (
              shift.CloseMoment
            )}
          </span>
        </div>
        {shift.CloseOwnerName && (
          <div style={styles.row}>
            <span style={styles.label}>Növbəni bağlayıb:</span>
            <span style={styles.value}>{shift.CloseOwnerName}</span>
          </div>
        )}
      </div>

      <CardItem
        valueFormatPrice={true}
        title={'Satış'}
        items={[
          { key: 'Məbləğ', value: shift.SalesAmount },
          { key: 'Nağd', value: shift.SalesCash },
          { key: 'Nağdsız', value: shift.SalesNonCash },
          { key: 'Bonus', value: shift.SalesUseBonus },
          { key: 'Borc', value: shift.SalesCredit },
        ]}
      />

      <CardItem
        valueFormatPrice={true}
        title={'Qaytarma'}
        items={[
          { key: 'Məbləğ', value: shift.RetsAmount },
          { key: 'Nağd', value: shift.RetsCash },
          { key: 'Nağdsız', value: shift.RetsNonCash },
          { key: 'Bonus', value: shift.RetsUseBonus },
          { key: 'Borc', value: shift.RetsCredit },
        ]}
      />
    </div>
  );
};

export default ShiftManage;
