import React, { useContext, useEffect, useState } from 'react';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { CustomerGlobalContext } from '../../shared/data/CustomerGlobalState';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from '../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import { formatPrice } from './../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from './../../shared/ui/RepllyMessage/SuccessMessage';
import { Button, SpinLoading } from 'antd-mobile';
import DestinationCard from '../../shared/ui/DestinationCard';
import { useNavigate, useParams } from 'react-router-dom';

const CustomerManage = () => {
  const navigate = useNavigate();
  let theme = useTheme();

  let { id } = useParams();
  if (id === 'null' || id === 'undefined') id = null;

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.bg,
      position: 'relative',
      overflow: 'hidden'
    },
    scrollView: {
      flex: 1,
      overflowY: 'auto',
      paddingBottom: 20
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    footer: {
      padding: 10,
      backgroundColor: '#fff',
      borderTop: '1px solid #eee'
    }
  };

  const { document, setDocument } = useContext(CustomerGlobalContext);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  let fetchingCustomer = async (id) => {
    if (id == null) {
      let obj = {
        Name: "",
        Card: "",
        Phone: "",
        Discount: 0,
        Bonus: 0,
        Mail: "",
        Description: "",
        Modifications: [],
        GroupName: "",
        GroupId: "",
        PriceTypeName: "",
        PriceTypeId: "",
        Description: ""
      };
      setDocument(obj);
    } else {
      await api('customers/get.php', {
        id: id,
        token: await AsyncStorageWrapper.getItem("token")
      }).then(async (element) => {
        if (element != null) {
          if (element.List[0]) {
            let customer = { ...element.List[0] };
            await api('pricetypes/get.php', {
              token: await AsyncStorageWrapper.getItem('token')
            }).then(item => {
              let index = item.List.findIndex(rel => rel.Id == element.List[0].PriceTypeId);
              if (index == -1) {
                customer.PriceTypeName = "";
              } else {
                customer.PriceTypeName = item.List[index].Name;
              }
            });
            customer.Discount = formatPrice(customer.Discount);
            customer.Bonus = formatPrice(customer.Bonus);
            setDocument(customer);
          }
        }
      }).catch(err => {
        ErrorMessage(err);
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    let x = { ...document };
    let data = formatObjectKey(x);
    data.token = await AsyncStorageWrapper.getItem('token');

    await api('customers/put.php', data)
      .then(element => {
        if (element != null) {
          SuccessMessage("Yadda Saxlanıldı");
          // Update the URL if it was a new creation
          if (id == null) {
            // Optional: navigate(`/customer/customer-manage/${element.ResponseService}`, { replace: true });
          }
          fetchingCustomer(element.ResponseService);
          setHasUnsavedChanges(false);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
    setLoading(false);
  };

  const hasUnsavedChangesFunction = () => {
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
  };

  const handleChangeInput = (key, value) => {
    setDocument(rel => ({ ...rel, [key]: value }));
    hasUnsavedChangesFunction();
  };

  const handleChangeSelection = (key, value) => {
    setDocument(rel => ({ ...rel, [key]: value }));
    hasUnsavedChangesFunction();
  };

  useEffect(() => {
    fetchingCustomer(id);
  }, [id]);

  return (
    <div style={styles.container}>
      <ManageHeader
        // navigation={navigate}
        document={document}
        hasUnsavedChanges={hasUnsavedChanges}
        onSubmit={handleSave}
      />
      {document == null ? (
        <div style={styles.loadingContainer}>
          <SpinLoading color='primary' />
        </div>
      ) : (
        <>
          <div style={styles.scrollView}>
            <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} />
            <DestinationCard
              changeInput={handleChangeInput}
              changeSelection={handleChangeSelection}
              document={document}
              setDocument={setDocument}
            />
          </div>
          {hasUnsavedChanges && (
            <div style={styles.footer}>
              <Button
                block
                color='success'
                loading={loading}
                onClick={handleSave}
              >
                Yadda Saxla
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerManage;
