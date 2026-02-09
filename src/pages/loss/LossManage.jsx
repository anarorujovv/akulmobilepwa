import React, { useCallback, useContext, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ProductCard from './manageLayouts/ProductCard';
import pricingUtils from '../../services/pricingUtils';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import Button from '../../shared/ui/Button';
import DestinationCard from './../../shared/ui/DestinationCard';
import moment from 'moment';
import calculateUnit from './../../services/report/calculateUnit';
import BuyerCard from './manageLayouts/BuyerCard';
import { LossGlobalContext } from '../../shared/data/LossGlobalState';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ModificationsCard from '../../shared/ui/ModificationsCard';
// import playSound from '../../services/playSound';
import { useLocation, useNavigate } from 'react-router-dom';

const LossManage = () => {
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

  let { id } = location.state || {};

  const { document, setDocument, units, setUnits } = useContext(LossGlobalContext);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fetchingDocument = async (id) => {
    if (id == null) {
      let obj = {
        Name: "",
        Moment: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        StockFromId: "",
        StockFromName: "",
        StockToId: "",
        StockToName: "",
        Modifications: [{}],
        Positions: [],
        Consumption: 0,
        Status: true,
        Amount: 0,
        Discount: 0,
        OwnerId: await AsyncStorageWrapper.getItem("ownerId") == null ? "" : await AsyncStorageWrapper.getItem('ownerId'),
        DepartmentId: await AsyncStorageWrapper.getItem("depId") == null ? "" : await AsyncStorageWrapper.getItem('depId'),
        Description: ""
      }

      await api('losses/newname.php', {
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
      await api('losses/get.php', obj)
        .then(async element => {
          if (element != null) {

            let documentData = { ...element.List[0] };
            let positions = calculateUnit(element.PositionUnits, documentData.Positions, "GET")

            if (!documentData.Modifications[0]) {
              documentData.Modifications = [{}];
            }
            setUnits(element.PositionUnits);
            setDocument({ ...documentData, ...(pricingUtils(positions)) });

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

    if (info.stockid !== "") {
      if (info.name == "") {
        await api('losses/newname.php', {
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

      info.modifications = await buildModificationsPayload(info.modifications[0], 'loss');
      info.token = await AsyncStorageWrapper.getItem("token")
      await api('losses/put.php', info).then(element => {
        if (element != null) {
          SuccessMessage("Yadda saxlanıldı.");
          fetchingDocument(element.ResponseService);
          setHasUnsavedChanges(false);
          //   playSound('success');
        }
      }).catch(err => {
        ErrorMessage(err)
      })
    } else {
      ErrorMessage("Anbar seçilməyib")
    }
    setLoading(false);
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

  useEffect(() => {
    fetchingDocument(id);
  }, [])

  return (

    <div style={styles.container}>
      {
        document == null ?
          <div style={styles.loading}>
            <div className="spinner"></div> // Web spinner
          </div>
          :
          <>
            <ManageHeader
              //   navigation={navigation}
              document={document}
              hasUnsavedChanges={hasUnsavedChanges}
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
                target={'loss'}
                hasUnsavedChanged={setHasUnsavedChanges}
                setState={setDocument}
                state={document}
              />
            </div>
            {
              hasUnsavedChanges ?
                <div style={{ padding: '10px' }}>
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

export default LossManage;
