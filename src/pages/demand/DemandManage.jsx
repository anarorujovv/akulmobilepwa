import React, { useCallback, useContext, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import BuyerCard from './manageLayouts/BuyerCard';
import ProductCard from './manageLayouts/ProductCard';
import pricingUtils from '../../services/pricingUtils';
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import { DemandGlobalContext } from '../../shared/data/DemandGlobalState';
import mergeProductQuantities from '../../services/mergeProductQuantities';
import { Button, SpinLoading } from 'antd-mobile';
import DestinationCard from './../../shared/ui/DestinationCard';
import moment from 'moment';
import calculateUnit from './../../services/report/calculateUnit';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import buildModificationsPayload from './../../services/buildModificationsPayload';
import fetchPaydirByDocument from './../../services/report/fetchPaydirByDocument';
import ReleatedDocuments from './../../shared/ui/ReleatedDocuments';
// import playSound from './../../services/playSound';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const DemandManage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.whiteGrey,
      overflow: 'hidden'
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '10px'
    },
    loading: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  // React Router URL params
  let { id } = useParams();

  // Fallback to location.state if navigated via state (legacy support or internal nav)
  // But prioritizing URL params is cleaner for deep linking.
  if (!id && location.state?.id) {
    id = location.state.id;
  }

  const { document, setDocument, units, setUnits } = useContext(DemandGlobalContext);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const permissions = useGlobalStore(state => state.permissions);

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

      if (permission_ver(permissions, 'demandactivate', 'R')) {
        obj.Status = true;
      }

      await api('demands/newname.php', {
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
      await api('demands/get.php', obj)
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

                setUnits(element.PositionUnits);
                if (!result.Modifications[0]) {
                  result.Modifications = [{}];
                }
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

    info.positions = calculateUnit(units, info.positions, 'POST')

    if (info.customerid !== "" || info.stockid !== "") {
      {

      }
      if (info.name == "") {
        await api('demands/newname.php', {
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


      info.modifications = await buildModificationsPayload(info.modifications[0], 'demand');
      info.token = await AsyncStorageWrapper.getItem("token")
      let documentId = await api('demands/put.php', info).then(async element => {
        if (element != null) {
          if (!info.id) {
            await fetchPaydirByDocument(element.ResponseService);
          }
          SuccessMessage("Yadda saxlanıldı.");
          fetchingDocument(element.ResponseService);
          setHasUnsavedChanges(false);
          //   playSound('success');
          return element.ResponseService;
        }
      }).catch(err => {
        ErrorMessage(err)
      })

      setLoading(false);
      return documentId || null;
    } else {
      ErrorMessage("Tərəf müqabil vəya Anbar seçilməyib");
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

  const handleDemandReturnClick = async (id) => {

    navigate('/demand/return', {
      state: {
        id: null,
        routeByDocument: {
          ...document,
          Id: null,
          link: id,
        },
        dataUnits: units,
      }
    });
  }

  const handleClickPayItem = (item) => {
  }

  useEffect(() => {
    fetchingDocument(id);
  }, [])

  return (

    <div style={styles.container}>
      {
        document == null ?
          <div style={styles.loading}>
            <SpinLoading />
          </div>
          :
          <>
            <ManageHeader
              // navigation={navigation}
              document={document}
              print={'demands'}
              isSubmitVisible={hasUnsavedChanges}
              onSubmit={handleSave}
              isPriceList={true}
              customMenu={[
                {
                  name: "Çek",
                  icon: "print",
                  onPress: () => {
                    navigate("/demand/check", {
                      state: {
                        demand: document
                      }
                    })
                  }
                }
              ]}
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

              <ReleatedDocuments
                payment={'ins'}
                //   navigation={navigation}
                document={{ ...document, target: 'demands' }}
                selection={[
                  {
                    onClick: handleDemandReturnClick,
                    Text: "Qaytarma"
                  }
                ]}
                onSubmit={handleSave}
                hasUnsavedChanged={hasUnsavedChanges}
                onClickItem={handleClickPayItem}
              />

              <ModificationsCard
                target={'demand'}
                setState={setDocument}
                state={document}
                hasUnsavedChanged={setHasUnsavedChanges}
              />

            </div>
            {
              hasUnsavedChanges ?
                <div style={{ padding: '10px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
                  <Button
                    block
                    color='success'
                    loading={loading}
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

export default DemandManage;
