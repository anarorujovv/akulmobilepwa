import React, { useEffect, useState } from 'react';
import useTheme from '../../../../../shared/theme/useTheme';
import api from '../../../../../services/api';
import AsyncStorageWrapper from '../../../../../services/AsyncStorageWrapper';
import ErrorMessage from '../../../../../shared/ui/RepllyMessage/ErrorMessage';
import ListItem from '../../../../../shared/ui/list/ListItem';
import ListPagesHeader from '../../../../../shared/ui/ListPagesHeader';
import FabButton from '../../../../../shared/ui/FabButton';
import Input from '../../../../../shared/ui/Input';
import Button from '../../../../../shared/ui/Button';
import SuccessMessage from '../../../../../shared/ui/RepllyMessage/SuccessMessage';
import MyModal from '../../../../../shared/ui/MyModal';

const SpendItem = () => {
  let theme = useTheme();

  const [productPurchase, setProductPurchase] = useState([]);
  const [costs, setCosts] = useState([]);

  const [manageModal, setManageModal] = useState(false);
  const [item, setItem] = useState(null);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    separator: {
      height: 1,
      backgroundColor: theme.whiteGrey,
      width: '100%'
    },
    halfSection: {
      width: '100%',
      height: '50%',
      display: 'flex',
      flexDirection: 'column',
    },
    scrollArea: {
      flex: 1,
      overflowY: 'auto'
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      width: '100%',
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  };

  let fetchingSpendItem = async () => {
    await api('spenditems/get.php', {
      token: await AsyncStorageWrapper.getItem('token')
    })
      .then((element) => {
        if (element != null) {
          let list = [...element.List];
          let productPurchaseList = list.filter(element => element.Target == 0);
          let costsList = list.filter(element => element.Target == 1);
          setProductPurchase(productPurchaseList);
          setCosts(costsList);
        }
      })
      .catch((err) => {
        ErrorMessage(err)
      })
  }

  const handleSaveButton = async () => {
    let obj = {
      name: item.Name,
      id: item.Id,
      token: await AsyncStorageWrapper.getItem("token")
    }

    await api('spenditems/put.php', obj)
      .then((element) => {
        if (element != null) {
          success();
        }
      })
      .catch((err) => {
        ErrorMessage(err)
      })
  }

  const handleDelete = async (item) => {
    if (window.confirm('Silməyə əminsiniz ?')) {
      await api('spenditems/del.php?id=' + item.Id, {
        token: await AsyncStorageWrapper.getItem('token')
      })
        .then((element) => {
          if (element != null) {
            success();
          }
        }).catch(err => {
          ErrorMessage(err)
        })
    }
  }

  const success = () => {
    SuccessMessage("Əməliyyat uğurla icra olundu!")
    setManageModal(false);
    setProductPurchase([]);
    setCosts([]);
    fetchingSpendItem();
  }

  useEffect(() => {
    fetchingSpendItem();
  }, [])

  return (
    <div style={styles.container}>

      <div style={styles.halfSection}>
        <ListPagesHeader header={'Məhsul alışı'} />
        <div style={styles.scrollArea}>
          {productPurchase[0] ? (
            productPurchase.map((item, index) => (
              <div key={item.Id}>
                <ListItem
                  onLongPress={() => handleDelete(item)}
                  firstText={item.Name}
                  onPress={() => {
                    setItem(item);
                    setManageModal(true)
                  }}
                  index={index + 1}
                />
                <div style={styles.separator} />
              </div>
            ))
          ) : (
            <div style={styles.loadingContainer}>
              <div className="spinner"></div> // or empty message
            </div>
          )}
        </div>
      </div>

      <div style={styles.halfSection}>
        <ListPagesHeader header={'Xərclər'} />
        <div style={styles.scrollArea}>
          {costs[0] ? (
            costs.map((item, index) => (
              <div key={item.Id}>
                <ListItem
                  index={index + 1}
                  onLongPress={() => handleDelete(item)}
                  firstText={item.Name}
                  onPress={() => {
                    setItem(item);
                    setManageModal(true)
                  }}
                />
                <div style={styles.separator} />
              </div>
            ))
          ) : (
            <div style={styles.loadingContainer}>
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>

      <FabButton
        onPress={() => {
          setManageModal(true);
          setItem({
            Name: "",
            Id: ""
          })
        }}
      />

      <MyModal
        modalVisible={manageModal}
        setModalVisible={setManageModal}
        center={true}
        width={'80%'}
      >
        {item != null ? (
          <div style={styles.modalContent}>
            <Input
              value={item.Name}
              onChange={(e) => {
                setItem(rel => ({ ...rel, ['Name']: e }));
              }}
              placeholder={'Ad'}
              width={'100%'}
              type={'text'}
            />
            <Button
              width={'100%'}
              isLoading={false}
              onClick={handleSaveButton}
            >
              Yadda Saxla
            </Button>
          </div>
        ) : ""}
      </MyModal>
    </div>
  )
}

export default SpendItem;
