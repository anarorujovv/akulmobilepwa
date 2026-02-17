import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import contains from '../../../services/contains';
import { List, Input, SpinLoading, AutoCenter } from 'antd-mobile';

const OwnerModal = ({
  state,
  setState
}) => {
  const theme = useTheme();
  const [infos, setInfos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchingInfos = async () => {
    await api('owners/get.php', {
      token: await AsyncStorageWrapper.getItem('token'),
    }).then((element) => {
      if (element != null) {
        if (element.List[0]) {
          setInfos([...element.List]);
        } else {
          setInfos(null)
        }
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  useEffect(() => {
    if (modalVisible && infos != null && !infos[0]) {
      fetchingInfos();
    }
  }, [modalVisible])

  useEffect(() => {
    fetchingInfos();
  }, [])

  return (
    <>
      <div onClick={() => setModalVisible(true)} style={{ width: '100%' }}>
        <Input
          readOnly
          value={contains(infos, state.OwnerId)?.Name || ''}
          placeholder='Cavabdeh'
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 4,
            padding: '6px 12px',
            '--font-size': '14px'
          }}
        />
      </div>

      <MyModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        width={'100%'}
      >
        <div style={{ height: '300px', overflowY: 'auto' }}>
          {infos === null ? (
            <AutoCenter style={{ padding: 20, color: theme.primary }}>
              Məlumat tapılmadı...
            </AutoCenter>
          ) : !infos.length ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <SpinLoading color='primary' />
            </div>
          ) : (
            <List>
              {infos.map((item, index) => (
                <List.Item
                  key={item.Id || index}
                  onClick={() => {
                    setState(rel => ({ ...rel, ['OwnerName']: item.Name }))
                    setState(rel => ({ ...rel, ['OwnerId']: item.Id }));
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
    </>
  )
}

export default OwnerModal;