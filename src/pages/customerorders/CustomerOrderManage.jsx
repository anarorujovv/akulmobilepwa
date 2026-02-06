import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ManageHeader from './../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import api from '../../services/api'
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BuyerCard from './manageLayouts/BuyerCard'
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
import { CustomerOrderGlobalContext } from '../../shared/data/CustomerOrderGlobalState';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import playSound from '../../services/playSound';
import ReleatedDocuments from '../../shared/ui/ReleatedDocuments';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';

const CustomerOrderManage = ({ route, navigation }) => {

  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.whiteGrey
    }
  })

  let { id } = route.params;
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
        OwnerId: await AsyncStorage.getItem("ownerId") == null ? "" : await AsyncStorage.getItem('ownerId'),
        DepartmentId: await AsyncStorage.getItem("depId") == null ? "" : await AsyncStorage.getItem('depId'),
        Description: ""
      }

      if (permission_ver(permissions, 'customerorderactivate', 'R')) {
        obj.Status = true;
      }

      await api('customerorders/newname.php', {
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
      await api('customerorders/get.php', obj)
        .then(async element => {
          if (element != null) {
            await api('customers/getdata.php', {
              id: element.List[0].CustomerId,
              token: await AsyncStorage.getItem('token')
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
          token: await AsyncStorage.getItem("token")
        }).then(element => {
          if (element != null) {
            info.name = element.ResponseService;
          }
        }).catch(err => {
          ErrorMessage(err)
        })
      }
      info.modifications = await buildModificationsPayload(info.modifications[0], 'customerorder')

      info.token = await AsyncStorage.getItem("token")
      let answer = await api('customerorders/put.php', info).then(element => {
        if (element != null) {
          SuccessMessage("Yadda saxlanıldı.");
          fetchingDocument(element.ResponseService);
          setHasUnsavedChanges(false);
          playSound('success');
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
              onSubmit={handleSave}
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
                  hasUnsavedChanged={setHasUnsavedChanges}
                  setState={setDocument}
                  state={document}
                  target={'customerorder'}
                />

                <ReleatedDocuments
                  payment={'ins'}
                  navigation={navigation}
                  document={{ ...document, target: 'customerorders' }}
                  selection={[
                  ]}
                  onSubmit={handleSave}
                  hasUnsavedChanged={hasUnsavedChanges}
                  onClickItem={handleClickPayItem}
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

export default CustomerOrderManage
