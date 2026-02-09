import React, { useCallback, useContext, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api'
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage'
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper'
import BuyerCard from './manageLayouts/BuyerCard'
import ProductCard from './manageLayouts/ProductCard'
import pricingUtils from '../../services/pricingUtils'
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import mergeProductQuantities from '../../services/mergeProductQuantities';
import Button from '../../shared/ui/Button';
// import prompt from '../../services/prompt'; // Web default confirm is fine or custom
import DestinationCard from './../../shared/ui/DestinationCard';
import moment from 'moment';
import calculateUnit from './../../services/report/calculateUnit';
import { CustomerOrderGlobalContext } from '../../shared/data/CustomerOrderGlobalState';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ModificationsCard from '../../shared/ui/ModificationsCard';
// import playSound from '../../services/playSound';
import ReleatedDocuments from '../../shared/ui/ReleatedDocuments';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomerOrderManage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let { id } = location.state || {}; // Get id from state

  const theme = useTheme();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.whiteGrey,
      overflowY: 'auto'
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: 10
    }
  };

  const permissions = useGlobalStore(state => state.permissions);

  const { document, setDocument, units, setUnits } = useContext(CustomerOrderGlobalContext);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fetchingDocument = async (id) => {

    if (id == null) {
      let obj = {
        Name: "",
        CustomerId: "",
        CustomerName: "",
        Moment: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        StockId: "",
        StockName: "",
        Modifications: [{}],
        Positions: [],
        Consumption: 0,
        Status: false,
        Amount: 0,
        Discount: 0,
        BasicAmount: 0,
        OwnerId: await AsyncStorageWrapper.getItem("ownerId") == null ? "" : await AsyncStorageWrapper.getItem('ownerId'),
        DepartmentId: await AsyncStorageWrapper.getItem("depId") == null ? "" : await AsyncStorageWrapper.getItem('depId'),
        Description: ""
      }

      if (permission_ver(permissions, 'customerorderactivate', 'R')) {
        obj.Status = true;
      }

      await api('customerorders/newname.php', {
        n: "",
        token: await AsyncStorageWrapper.getItem("token")
      }).then(element => {
        if (element != null) {
          obj.Name = element.ResponseService;
        }
      }).catch(err => {
        ErrorMessage(err)
      })

      setDocument(obj);
    } else {
      let obj = {
        id: id,
        token: await AsyncStorageWrapper.getItem('token')
      }
      await api('customerorders/get.php', obj)
        .then(async element => {
          if (element != null) {
            await api('customers/getdata.php', {
              id: element.List[0].CustomerId,
              token: await AsyncStorageWrapper.getItem('token')
            }).then(async item => {
              if (item != null) {
                let documentData = { ...element.List[0] };
                documentData.BasicAmount = 0;
                documentData.CustomerInfo = item;
                documentData.CustomerInfo.CustomerData.Id = documentData.CustomerId
                documentData.CustomerInfo.CustomerData.Discount = formatPrice(documentData.CustomerInfo.CustomerData.Discount)

                let result = await mergeProductQuantities(documentData, documentData.StockId);
                let positions = calculateUnit(element.PositionUnits, result.Positions, "GET")

                if (!result.Modifications[0]) {
                  result.Modifications = [{}]
                }

                setUnits(element.PositionUnits);
                setDocument({ ...result, ...(pricingUtils(positions)) });

              }
            }).catch(err => {
              ErrorMessage(err)
            })
          }
        })
        .catch(err => {
          ErrorMessage(err)
        })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    let data = { ...document }
    let info = { ...formatObjectKey(data) };
    info.positions = calculateUnit(units, info.positions, 'POST');

    if (info.customerid !== "" || info.stockid !== "") {
      if (info.name == "") {
        await api('customerorders/newname.php', {
          n: "",
          token: await AsyncStorageWrapper.getItem("token")
        }).then(element => {
          if (element != null) {
            info.name = element.ResponseService;
          }
        }).catch(err => {
          ErrorMessage(err)
        })
      }
      info.modifications = await buildModificationsPayload(info.modifications[0], 'customerorder')

      info.token = await AsyncStorageWrapper.getItem("token")
      let answer = await api('customerorders/put.php', info).then(element => {
        if (element != null) {
          SuccessMessage("Yadda saxlanıldı.");
          fetchingDocument(element.ResponseService);
          setHasUnsavedChanges(false);
          // playSound('success');
          return element.ResponseService
        }
      }).catch(err => {
        ErrorMessage(err)
      })

      setLoading(false);
      return answer || null
    } else {
      ErrorMessage("Tərəf müqabil vəya Anbar seçilməyib")
      setLoading(false);
      return null;
    }
  }

  const hasUnsavedChangesFunction = () => {
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
  }

  const handleChangeInput = (key, value) => {
    setDocument(rel => ({ ...rel, [key]: value }))
    hasUnsavedChangesFunction();
  }

  const handleChangeSelection = (key, value) => {
    setDocument(rel => ({ ...rel, [key]: value }))
    hasUnsavedChangesFunction();
  }

  const handleClickPayItem = (item) => {
  }

  useEffect(() => {
    fetchingDocument(id);
  }, [id])

  return (
    <div style={styles.container}>
      {
        document == null ?
          <div style={styles.loadingContainer}>
            <div className="spinner"></div>
          </div>
          :
          <>
            <ManageHeader
              // navigation={navigation}
              document={document}
              hasUnsavedChanges={hasUnsavedChanges}
              onSubmit={handleSave}
            />

            <div style={styles.content}>

              <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
              <BuyerCard changeSelection={handleChangeSelection} />
              <ProductCard setHasUnsavedChanges={setHasUnsavedChanges} />
              <DestinationCard
                document={document}
                setDocument={setDocument}
                changeInput={handleChangeInput}
                changeSelection={handleChangeSelection}
              />
              <ModificationsCard
                hasUnsavedChanged={setHasUnsavedChanges}
                setState={setDocument}
                state={document}
                target={'customerorder'}
              />

              <ReleatedDocuments
                payment={'ins'}
                // navigation={navigation}
                document={{ ...document, target: 'customerorders' }}
                selection={[
                ]}
                onSubmit={handleSave}
                hasUnsavedChanged={hasUnsavedChanges}
                onClickItem={handleClickPayItem}
              />
            </div>

            {
              hasUnsavedChanges ?
                <div style={{ padding: 10 }}>
                  <Button
                    bg={theme.green}
                    disabled={loading}
                    isLoading={loading}
                    onClick={handleSave}
                  >
                    Yadda Saxla
                  </Button>
                </div>
                :
                ""
            }
          </>
      }
    </div>
  )
}

export default CustomerOrderManage;
