import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import { List, SpinLoading, AutoCenter } from 'antd-mobile';

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

  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      width={'100%'}
    >
      <div style={{ height: '300px', overflowY: 'auto' }}>
        {stocks === null ? (
          <AutoCenter style={{ padding: 20, color: theme.primary }}>
            Məlumat tapılmadı...
          </AutoCenter>
        ) : !stocks.length ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <SpinLoading color='primary' />
          </div>
        ) : (
          <List header='Anbarlar'>
            {stocks.map((item, index) => (
              <List.Item
                key={item.Id || index}
                onClick={() => {
                  setProduct(rel => ({ ...rel, ['StockName']: item.Name }));
                  setProduct(rel => ({ ...rel, ['StockId']: item.Id }));
                  setModalVisible(false);
                }}
                arrow={false}
              >
                {item.Name}
              </List.Item>
            ))}
          </List>
        )}
      </div>
    </MyModal>
  )
}

export default StockModal;