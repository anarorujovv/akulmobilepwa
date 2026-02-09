import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import Input from '../Input';
import contains from '../../../services/contains';

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

  const renderItem = (item, index) => {
    return (
      <div key={item.Id || index} style={{ width: '100%' }}>
        <div onClick={() => {
          setState(rel => ({ ...rel, ['OwnerName']: item.Name }))
          setState(rel => ({ ...rel, ['OwnerId']: item.Id }));
          setModalVisible(false);
        }}
          style={{
            width: '100%',
            height: 55,
            paddingLeft: 20,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
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
    if (modalVisible && infos != null && !infos[0]) {
      fetchingInfos();
    }

  }, [modalVisible])

  useEffect(() => {
    fetchingInfos();
  }, [])

  const styles = {
    trigger: {
      width: '100%',
      cursor: 'pointer'
    },
    loadingTrigger: {
      width: '100%',
      height: 55,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
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
    <>
      {
        infos[0] ?
          <div style={styles.trigger} onClick={() => setModalVisible(true)}>
            <Input
              disabled={true}
              type={'string'}
              width={'100%'}
              value={contains(infos, state.OwnerId) == null ? "" : contains(infos, state.OwnerId).Name}
              placeholder={'Cavabdeh'}
            />
          </div>
          :
          <div style={styles.loadingTrigger}>
            <div className="spinner"></div>
          </div>
      }
      <MyModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        width={'100%'}
      >
        {
          infos == null ?
            <div style={styles.noDataContainer}>
              <span style={{
                fontSize: 16,
                color: theme.primary
              }}>Məlumat tapılmadı...</span>
            </div>
            :
            <div style={styles.listContainer}>
              {
                infos[0] ?
                  infos.map((item, index) => renderItem(item, index))
                  :
                  <div style={styles.noDataContainer}>
                    <div className="spinner"></div>
                  </div>
              }
            </div>
        }
      </MyModal>
    </>
  )
}

export default OwnerModal;