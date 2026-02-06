import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import CardItem from '../../shared/ui/list/CardItem';

const ShiftManage = ({ route, navigation }) => {

  let { id } = route.params;

  let theme = useTheme();

  let [shift, setShift] = useState(null);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.bg,
    },
    header: {
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      color: theme.black,
      fontWeight: 'bold',
    },
    value: {
      fontSize: 14,
      color: theme.black,
    },
    status: {
      fontSize: 14,
      color: theme.green,
      fontWeight: 'bold',
    },
    sectionHeader: {
      textAlign: 'center',
      marginVertical: 16,
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.grey,
    },
    infoSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    column: {
      flex: 1,
      alignItems: 'center',
    },
    subHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    detailsSection: {
      marginTop: 16,
    },
  });

  let fetchingData = async () => {
    let obj = {
      id: id,
      token: await AsyncStorage.getItem('token')
    }
    await api('shifts/get.php', obj)
      .then(element => {
        if (element != null) {
          setShift(element.List[0]);
        }
      })
      .catch(err => {
        ErrorMessage(err)
      })
  }

  useEffect(() => {
    fetchingData();
  }, [id])

  return (
    <View style={styles.container}>
      {/* Üst Bilgiler */}
      {
        shift == null ?
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator size={40} color={theme.primary} />
          </View>
          :
          <View style={{
            flex: 1,
          }}>
            <View style={styles.header}>
              <View style={styles.row}>
                <Text style={styles.label}>Satış nöqtəsi:</Text>
                <Text style={styles.value}>{shift.SalePointName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Açılıb:</Text>
                <Text style={styles.value}>{shift.OpenMoment}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Növbəni açıb:</Text>
                <Text style={styles.value}>{shift.OpenOwnerName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Kassa nömrəsi:</Text>
                <Text style={styles.value}>{shift.RegisterId}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Bağlanıb:</Text>
                <Text style={styles.status}>{shift.CloseMoment == null ? 'Açıqdır' : shift.CloseMoment}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Növbəni bağlayıb:</Text>
                <Text style={styles.value}>{shift.CloseOwnerName}</Text>
              </View>
            </View>

            <View>
              <CardItem
                valueFormatPrice={true}
                title={'Satış'}
                items={[
                  {
                    key: 'Satış',
                    value: shift.SalesAmount
                  },
                  {
                    key: 'Nağd',
                    value: shift.SalesCash
                  },
                  {
                    key: 'Nağdsız',
                    value: shift.SalesNonCash
                  },
                  {
                    key: 'Bonus',
                    value: shift.SalesUseBonus
                  },
                  {
                    key: 'Borc',
                    value: shift.SalesCredit
                  },
                ]}
              />
              <CardItem
                title={'Qaytarma'}
                items={[
                  {
                    key: 'Qaytarmalar',
                    value: shift.RetsAmount
                  },
                  {
                    key: 'Nağd',
                    value: shift.RetsCash
                  },
                  {
                    key: 'Nağdsız',
                    value: shift.RetsNonCash
                  },
                  {
                    key: 'Bonus',
                    value: shift.RetsUseBonus
                  },
                  {
                    key: 'Borc',
                    value: shift.RetsCredit
                  },
                ]}
              />
            </View>
          </View>
      }

    </View>
  );
};



export default ShiftManage;
