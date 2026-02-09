import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import Input from '../Input';
import contains from '../../../services/contains';
import { formatPrice } from '../../../services/formatPrice';

const CashesModal = ({
  document,
  setDocument,
  type,
  returnChanged,
  selectedType,
}) => {
  const theme = useTheme();

  const [cashs, setCashs] = useState([]);
  const [cashModal, setCashModal] = useState(false);

  const fetchingCashes = async () => {
    await api('cashes/get.php', {
      token: await AsyncStorageWrapper.getItem('token'),
    })
      .then(element => {
        if (element != null) {
          if (element.List[0]) {
            setCashs([...element.List]);
          } else {
            setCashs(null);
          }
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  const renderItem = (item, index) => {
    return (
      <div key={item.Id || index} style={{ width: '100%' }}>
        <div
          onClick={() => {
            setDocument(rel => ({ ...rel, ['CashName']: item.Name }));
            setDocument(rel => ({ ...rel, ['CashId']: item.Id }));
            setCashModal(false);
            if (returnChanged) {
              returnChanged();
            }

            if (selectedType != undefined) {
              selectedType(item);
            }
          }}
          style={{
            width: '100%',
            height: 55,
            paddingLeft: 20,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 'none',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.input.grey}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span
            style={{
              color: theme.black,
              fontSize: 13,
            }}>
            {item.Name}
          </span>
        </div>
        <Line width={'90%'} />
      </div>
    );
  };

  useEffect(() => {
    if (cashModal && cashs != null && !cashs[0]) {
      fetchingCashes();
    }
  }, [cashModal]);

  useEffect(() => {
    fetchingCashes();
  }, []);

  const styles = {
    loadingContainer: {
      width: '100%',
      height: 55,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    trigger: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer'
    },
    balanceRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '70%',
    }
  }

  return (
    <>
      {cashs[0] ? (
        <div
          style={styles.trigger}
          onClick={() => {
            setCashModal(true);
          }}>
          <Input
            isRequired={true}
            width={'70%'}
            disabled={true}
            value={
              contains(cashs, document.CashId) == null
                ? ''
                : contains(cashs, document.CashId).Name
            }
            placeholder={'Hesab'}
          />
          {contains(cashs, document.CashId) == null ? (
            ''
          ) : (
            <div
              style={styles.balanceRow}>
              <span style={{ fontSize: 12, color: theme.orange }}>Balans</span>
              <span
                style={{
                  fontSize: 12,
                  color:
                    formatPrice(contains(cashs, document.CashId).Balance) >= 0
                      ? theme.black
                      : theme.orange,
                }}>
                {formatPrice(contains(cashs, document.CashId).Balance)} ₼
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          style={styles.loadingContainer}>
          <div className="spinner"></div>
        </div>
      )}
      <MyModal
        modalVisible={cashModal}
        setModalVisible={setCashModal}
        width={'100%'}>
        {cashs == null ? (
          <div
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 16,
                color: theme.primary,
              }}>
              Məlumat tapılmadı...
            </span>
          </div>
        ) : cashs[0] ? (
          <div style={{ width: '100%', overflowY: 'auto', maxHeight: '400px' }}>
            {cashs.map((item, index) => renderItem(item, index))}
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <div className="spinner"></div>
          </div>
        )}
      </MyModal>
    </>
  );
};

export default CashesModal;
