import React, { useEffect, useState } from 'react';
import { Card, List, Button, Modal } from 'antd-mobile';
import { IoDocuments } from 'react-icons/io5';
import useTheme from '../theme/useTheme';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import api from '../../services/api';
import ListItem from './list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import { useNavigate } from 'react-router-dom';

const ReleatedDocuments = ({ document, selection, payment, paymentPath, shouldDisable, onSubmit, hasUnsavedChanged, onClickItem }) => {

  let theme = useTheme();
  const navigate = useNavigate();

  const styles = {
    header: {
      width: '100%',
      padding: 15,
      gap: 10,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      boxSizing: 'border-box'
    },
    modalContent: {
      flex: 1,
      gap: 15,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.whiteGrey,
      borderRadius: 5,
      height: '100%',
      width: '100%'
    },
    optionButton: {
      padding: 10,
      border: `1px solid ${theme.primary}`,
      borderRadius: 5,
      width: '80%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundColor: 'transparent'
    },
    optionText: {
      color: theme.primary,
      fontWeight: 'bold',
      margin: 0
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  };

  const [releatedDocuments, setReleatedDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApiReleatedDocuments = async () => {

    if (document.Id) {
      let obj = {
        doctype: document.target,
        id: document.Id,
        token: await AsyncStorageWrapper.getItem("token"),
      };

      await api('links/get.php', obj)
        .then(element => {
          if (element != null) {
            if (element.List[0]) {
              setReleatedDocuments(element.List);
            } else {
              setReleatedDocuments(null);
            }
          }
        })
        .catch(err => {
          ErrorMessage(err);
        });
    } else {
      setReleatedDocuments(null);
    }
  };

  const handlePayment = (documentLastId) => {
    let params = {
      id: null,
      type: "payment",
      direct: payment,
      routeByDocument: { ...document, Id: documentLastId }
    }

    if (paymentPath) {
      navigate(paymentPath, { state: params });
    } else {
      console.error("paymentPath prop is missing in ReleatedDocuments");
    }
  }

  const click = async (type, clickFunction) => {
    setIsLoading(true)

    let id = null;

    if (!hasUnsavedChanged) {
      if (document.Id != undefined) {
        id = document.Id;
      } else {
        ErrorMessage("Boş sənədə əlaqəli sənət yaradmaq olmaz!")
      }
    } else {
      id = await onSubmit();
    }

    if (id) {
      setModalVisible(false)
      if (type == 'pay') {
        handlePayment(id);
      } else {
        clickFunction(id);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (releatedDocuments == null || releatedDocuments[0]) {
      setReleatedDocuments([]);
    }
    fetchApiReleatedDocuments();
  }, []);


  return (
    <>
      {(
        <Card
          style={{
            paddingTop: 10,
            paddingBottom: 10,
          }}
          title={
            <div style={styles.header}>
              <IoDocuments size={20} color={theme.grey} />
              <span style={{ color: theme.grey }}>Əlaqəli sənədlər</span>
            </div>
          }
        >
          {
            releatedDocuments == null ?
              ""
              :
              releatedDocuments[0] ? (
                <List>
                  {releatedDocuments.map((element, index) => (
                    <ListItem
                      key={index}
                      firstText={element.Moment}
                      centerText={element.Name}
                      priceText={formatPrice(element.Amount)}
                      index={index + 1}
                      onPress={() => {
                        onClickItem(element);
                      }}
                    />
                  ))}
                </List>
              ) : (
                <div style={styles.loadingContainer}>
                  <div className="spinner"></div>
                </div>
              )}

          {
            !shouldDisable &&
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'center',
              marginBottom: 30,
              marginTop: 10,
            }}>
              <Button
                color='primary'
                block
                onClick={() => {
                  setModalVisible(true);
                }}
                style={{ width: '70%' }}
              >
                Sənəd yarat
              </Button>
            </div>
          }
        </Card>
      )}

      <Modal
        visible={modalVisible}
        content={
          <div style={{ ...styles.modalContent, width: '80vw', height: '30vh', padding: '20px' }}>
            {
              !isLoading ?
                <>
                  {
                    payment &&
                    <button style={styles.optionButton} onClick={() => {
                      click('pay');
                    }}>
                      <span style={styles.optionText}>Ödəniş</span>
                    </button>
                  }

                  {selection != undefined &&
                    selection.map((element, index) => {
                      return (
                        <button key={index} style={styles.optionButton} onClick={() => {
                          click('custom', element.onClick);
                        }}>
                          <span style={styles.optionText}>{element.Text}</span>
                        </button>
                      )
                    })
                  }
                </>
                :
                <div style={styles.loadingContainer}>
                  <div className="spinner"></div>
                </div>
            }
          </div>
        }
        closeOnMaskClick
        onClose={() => setModalVisible(false)}
        showCloseButton
      />
    </>
  );
};

export default ReleatedDocuments;
