import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { CustomerGlobalContext } from '../../shared/data/CustomerGlobalState';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from '../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import { formatPrice } from './../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from './../../shared/ui/RepllyMessage/SuccessMessage';
import Button from '../../shared/ui/Button';
import prompt from '../../services/prompt';
import { useFocusEffect } from '@react-navigation/native';
import DestinationCard from '../../shared/ui/DestinationCard';
import playSound from '../../services/playSound';

const CustomerManage = ({ route, navigation }) => {

  let { id } = route.params;
  let theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.bg
    }
  })

  const { document, setDocument } = useContext(CustomerGlobalContext);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  let fetchingCustomer = async (id) => {
    if (id == null) {
      let obj = {
        Name: "",
        Card: 0,
        Phone: 0,
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
      }

      setDocument(obj);
    } else {
      await api('customers/get.php', {

        id: id,
        token: await AsyncStorage.getItem("token")

      }).then(async (element) => {

        if (element != null) {
          if (element.List[0]) {
            let customer = { ...element.List[0] };
            await api('pricetypes/get.php', {
              token: await AsyncStorage.getItem('token')
            }).then(item => {
              let index = item.List.findIndex(rel => rel.Id == element.List[0].PriceTypeId);
              if (index == -1) {
                customer.PriceTypeName = ""
              } else {
                customer.PriceTypeName = item.List[index].Name
              }

            })
            customer.Discount = formatPrice(customer.Discount);
            customer.Bonus = formatPrice(customer.Bonus)
            setDocument(customer)
          }
        }

      }).catch(err => {
        ErrorMessage(err)
      })
    }


  }

  const handleSave = async () => {

    setLoading(true)

    let x = {
      ...document
    }

    let data = formatObjectKey(x);
    data.token = await AsyncStorage.getItem('token');

    await api('customers/put.php', data)
      .then(element => {
        if (element != null) {
          SuccessMessage("Yadda Saxlanıldı")
          setDocument(null);
          fetchingCustomer(element.ResponseService);
          setHasUnsavedChanges(false);
          playSound('success');
        }
      })
      .catch(err => {
        ErrorMessage(err)
      })
    setLoading(false)
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
    fetchingCustomer(id);
  }, [])


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

  return (
    <View style={styles.container}>
      <ManageHeader
        navigation={navigation}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      {
        document == null ?
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator size={40} color={theme.primary} />
          </View>
          :
          <>
            <ScrollView>
              <MainCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} />
              <DestinationCard
                changeInput={handleChangeInput}
                changeSelection={handleChangeSelection}
                document={document}
                setDocument={setDocument}
              />
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

export default CustomerManage

