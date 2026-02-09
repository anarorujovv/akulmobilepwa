import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';

const StockModal = ({
  modalVisible,
  setModalVisible,
  setProduct
}) => {

  const theme = useTheme();

  const [stocks, setStocks] = useState([]);

  const fetchingStocks = async () => {
    await api('stocks/get.php', {
      token: await AsyncStorageWrapper.getItem('token'),
    }).then((element) => {
      if (element != null) {
        if (element.List[0]) {
          setStocks([...element.List]);
        } else {
          setStocks(null)
        }
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  const renderItem = (item, index) => {
    return (
      <div key={item.Id || index} style={{ width: '100%' }}>
        <div onClick={() => {
          setProduct(rel => ({ ...rel, ['StockName']: item.Name }))
          setProduct(rel => ({ ...rel, ['StockId']: item.Id }));
          setModalVisible(false);
        }}
          style={{
            width: '100%',
            height: 55,
            paddingLeft: 20,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.input.grey}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{
            color: theme.black,
            fontSize: 13
          }}>{item.Name}</span>
        </div>
        <Line width={'90%'} />
      </div>
    )
  }

  useEffect(() => {
    if (modalVisible && stocks != null && !stocks[0]) {
      fetchingStocks();
    }

    if (!modalVisible) {
      setStocks([])
    }
  }, [modalVisible])

  useEffect(() => {
    fetchingStocks();
  }, [])

  const styles = {
    noDataContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    listContainer: {
      width: '100%',
      height: '100%',
      overflowY: 'auto'
    }
  }

  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      width={'100%'}
    >
      {
        stocks == null ?
          <div style={styles.noDataContainer}>
            <span style={{
              fontSize: 16,
              color: theme.primary
            }}>Məlumat tapılmadı...</span>
          </div>
          :
          <div style={styles.listContainer}>
            {
              stocks[0] ?
                stocks.map((item, index) => renderItem(item, index))
                :
                <div style={styles.noDataContainer}>
                  <div className="spinner"></div>
                </div>
            }
          </div>
      }
    </MyModal>
  )
}

export default StockModal;