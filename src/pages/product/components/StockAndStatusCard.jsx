import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import useTheme from '../../../shared/theme/useTheme';
import { ProductGlobalContext } from '../../../shared/data/ProductGlobalState';
import MySwitch from '../../../shared/ui/MySwitch';
import { formatPrice } from '../../../services/formatPrice';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import Entypo from 'react-native-vector-icons/Entypo';

const StockAndStatusCard = ({ id, changeInput }) => {
  let { product } = useContext(ProductGlobalContext);
  let theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      elevation: 2,
      shadowColor: theme.black,
      backgroundColor: theme.bg,
      alignItems: 'center',
      paddingBottom: 50,
    },
    header: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      padding: 15,
    },
    center: {
      gap: 10,
    },
    imageContainer: {
      height: 200,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    addImageButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: theme.primary,
      alignItems: 'center',
      marginVertical: 10,
    },
    addImageText: {
      color: theme.stable.white,
      fontSize: 16,
    },
    imagesList: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    imageItem: {
      width: 100,
      height: 100,
      margin: 5,
      borderRadius: 5,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    loadingText: {
      color: theme.grey,
      marginTop: 10,
    }
  });

  const getGenerateIsWeightFormatBarcode = async () => {
    await api('barcode/get.php', {
      w: 1,
      token: await AsyncStorage.getItem('token'),
    })
      .then(element => {
        if (element != null) {
          changeInput('BarCode', String(element));
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  const getGenerateBarCode = async () => {
    await api('barcode/get.php', {
      w: 0,
      token: await AsyncStorage.getItem('token'),
    })
      .then(element => {
        if (element != null) {
          changeInput('BarCode', String(element))
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Entypo size={20} color={theme.grey} name='info-with-circle' />
        <Text
          style={{
            color: theme.grey,
          }}>
          Məlumat
        </Text>
      </View>
      <View style={styles.center}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: theme.grey,
            }}>
            Anbar qalığı
          </Text>

          <Text
            style={{
              fontWeight: 'bold',
              color:
                formatPrice(product.StockBalance) > 0 ? theme.green : theme.red,
            }}>
            {formatPrice(product.StockBalance)
              ? formatPrice(product.StockBalance)
              : 0}{' '}
            - əd
          </Text>
        </View>
        <MySwitch
          onChange={e => {
            changeInput('IsWeight', e ? 1 : 0);
            if (e) {
              getGenerateIsWeightFormatBarcode();
            } else {
              getGenerateBarCode();
            }
          }}
          value={product.IsWeight === 1 ? true : false}
          text={'Çəki'}
          disabled={id != null}
          width={'70%'}
        />
        <MySwitch
          onChange={e => {
            if (e) {
              changeInput('IsArch', 1);
            } else {
              changeInput('IsArch', 0)
            }
          }}
          value={product.IsArch === 1 ? true : false}
          text={'Arxiv'}
          width={'70%'}
        />
      </View>

    </View>
  );
};

export default StockAndStatusCard;
