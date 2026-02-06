import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api'
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProductCard from './manageLayouts/ProductCard'
import pricingUtils from '../../services/pricingUtils'
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import mergeProductQuantities from '../../services/mergeProductQuantities';
import Button from '../../shared/ui/Button';
import prompt from '../../services/prompt';
import { useFocusEffect } from '@react-navigation/native';
import DestinationCard from './../../shared/ui/DestinationCard';
import moment from 'moment';
import calculateUnit from './../../services/report/calculateUnit';
import { MoveGlobalContext } from '../../shared/data/MoveGlobalState';
import BuyerCard from './manageLayouts/BuyerCard';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import playSound from '../../services/playSound';

const MoveManage = ({ route, navigation }) => {

  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.whiteGrey
    }
  })

  let { id } = route.params;

  const { document, setDocument, units, setUnits } = useContext(MoveGlobalContext);
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
        BasicAmount: 0,
        OwnerId: await AsyncStorage.getItem("ownerId") == null ? "" : await AsyncStorage.getItem('ownerId'),
        DepartmentId: await AsyncStorage.getItem("depId") == null ? "" : await AsyncStorage.getItem('depId'),
        Description: ""
      }

      await api('moves/newname.php', {
        n: "",
        token: await AsyncStorage.getItem("token")
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
        token: await AsyncStorage.getItem('token')
      }
      await api('moves/get.php', obj)
        .then(async element => {
          if (element != null) {

            let documentData = { ...element.List[0] };
            documentData.BasicAmount = 0;

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

    if (info.stocktoid !== "" || info.stockfromid !== "") {
      if (info.name == "") {
        await api('moves/newname.php', {
          n: "",
          token: await AsyncStorage.getItem("token")
        }).then(element => {
          if (element != null) {
            info.name = element.ResponseService;
          }
        }).catch(err => {
          ErrorMessage(err)
        })
      }

      info.modifications = await buildModificationsPayload(info.modifications[0], 'move');
      info.token = await AsyncStorage.getItem("token")
      await api('moves/put.php', info).then(element => {
        if (element != null) {
          SuccessMessage("Yadda saxlanıldı.");
          fetchingDocument(element.ResponseService);
          setHasUnsavedChanges(false);
          playSound('success');
        }
      }).catch(err => {
        ErrorMessage(err)
      })
    } else {
      ErrorMessage("Anbarlar seçilməyib")
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

  useFocusEffect(

    useCallback(() => {
      const onBackPress = async () => {
        navigation.setParams({ shouldGoToSpecificPage: false });
        hasUnsavedChanges ? prompt('Çıxmağa əminsiniz ?', () => navigation.goBack()) : (navigation.goBack());
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [hasUnsavedChanges]))

  useEffect(() => {
    fetchingDocument(id);
  }, [])



  return (

    <View style={styles.container}>
      {
        document == null ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={40} color={theme.primary} />
          </View>
          :
          <>
            <ManageHeader
              navigation={navigation}
              document={document}
              hasUnsavedChanges={hasUnsavedChanges}
            />

            <ScrollView>
              <View style={{
                gap: 20
              }}>

                <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} navigation={navigation} id={id} />
                <BuyerCard changeSelection={handleChangeSelection} />
                <ProductCard setHasUnsavedChanges={setHasUnsavedChanges} navigation={navigation} />
                <DestinationCard
                  document={document}
                  setDocument={setDocument}
                  changeInput={handleChangeInput}
                  changeSelection={handleChangeSelection}
                />
                <ModificationsCard
                  target={'move'}
                  hasUnsavedChanged={setHasUnsavedChanges}
                  setState={setDocument}
                  state={document}
                />

              </View>
            </ScrollView>
            {
              hasUnsavedChanges ?
                <Button
                  bg={theme.green}
                  disabled={loading}
                  isLoading={loading}
                  onClick={handleSave}
                >
                  Yadda Saxla
                </Button>
                :
                ""
            }
          </>
      }
    </View>
  )
}

export default MoveManage
