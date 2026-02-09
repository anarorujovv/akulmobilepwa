import React, { useContext } from 'react';
import useTheme from '../../../shared/theme/useTheme';
import { ProductGlobalContext } from '../../../shared/data/ProductGlobalState';
import MySwitch from '../../../shared/ui/MySwitch';
import { formatPrice } from '../../../services/formatPrice';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import { IoInformationCircle } from 'react-icons/io5';

const StockAndStatusCard = ({ id, changeInput }) => {
  let { product } = useContext(ProductGlobalContext);
  let theme = useTheme();

  const styles = {
    container: {
      width: '100%',
      backgroundColor: theme.bg,
      display: 'flex', // Changed for web
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 50,
      boxShadow: `0 2px 4px ${theme.black}20`
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      padding: 15,
      alignItems: 'center',
      boxSizing: 'border-box'
    },
    center: {
      gap: 10,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center'
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      display: 'flex',
      width: '70%'
    }
  };

  const getGenerateIsWeightFormatBarcode = async () => {
    await api('barcode/get.php', {
      w: 1,
      token: await AsyncStorageWrapper.getItem('token'),
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
      token: await AsyncStorageWrapper.getItem('token'),
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
    <div style={styles.container}>
      <div style={styles.header}>
        <IoInformationCircle size={20} color={theme.grey} />
        <span
          style={{
            color: theme.grey,
          }}>
          Məlumat
        </span>
      </div>
      <div style={styles.center}>
        <div
          style={styles.row}>
          <span
            style={{
              color: theme.grey,
            }}>
            Anbar qalığı
          </span>

          <span
            style={{
              fontWeight: 'bold',
              color:
                formatPrice(product.StockBalance) > 0 ? theme.green : theme.red,
            }}>
            {formatPrice(product.StockBalance)
              ? formatPrice(product.StockBalance)
              : 0}{' '}
            - əd
          </span>
        </div>
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
      </div>

    </div>
  );
};

export default StockAndStatusCard;
