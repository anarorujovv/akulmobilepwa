import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import useTheme from '../../../shared/theme/useTheme';
import { CustomerGlobalContext } from '../../../shared/data/CustomerGlobalState';
import Input from './../../../shared/ui/Input';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import IconButton from '../../../shared/ui/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Pressable } from '@react-native-material/core';
import CustomerGroupsModal from '../../../shared/ui/modals/CustomerGroups';
import PricesModal from './../../../shared/ui/modals/PricesModal';
import Selection from '../../../shared/ui/Selection';

const MainCard = ({ changeInput, changeSelection }) => {

  let theme = useTheme();

  const { document, setDocument } = useContext(CustomerGlobalContext);
  const [groupModal, setGrouoModal] = useState(false);
  const [pricesModal, setPricesModal] = useState(false)


  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      gap: 10,
      padding: 15,
      alignItems: 'center',
      width: '100%'
    }
  })

  const handleChange = (type, value) => {
    changeInput(type, value);
  }

  const fetchingBarCode = async () => {
    let obj = {
      w: 2,
      token: await AsyncStorage.getItem('token')
    }
    await api('barcode/get.php', obj)
      .then(element => {
        if (element != null) {
          handleChange('Card', element);
        }
      })
      .catch(err => {
        ErrorMessage(err)
      })
  }

  return (

    <>
      <ManageCard>

        <View style={styles.header}>
          <FontAwesome6 name='user-large' color={theme.grey} size={20} />
          <Text style={{
            color: theme.grey
          }}>Tərəf-müqabil</Text>
        </View>

        <View style={{
          width: '100%',
          alignItems: 'center'
        }}>

          <Input
            isRequired={true}
            placeholder={"Tərəf müqabilinin adı"}
            width={'70%'}
            type={'string'}
            value={document.Name}
            onChange={(e) => {
              handleChange('Name', e)
            }}
          />
          <View style={{ margin: 10 }} />

          <Selection
          isRequired={true}
            apiBody={{}}
            apiName={'customergroups/get.php'}
            change={(item) => {
              handleChange('GroupId', item.Id);
            }}
            title={'Qrup'}
            value={document.GroupId}
            defaultValue={document.GroupName}

          />

          <View style={{ margin: 10 }} />
          <Selection
            apiBody={{}}
            apiName={'pricetypes/get.php'}
            value={document.PriceTypeId}
            defaultValue={document.PriceTypeName}
            change={(e) => {
              handleChange('PriceTypeId', e.Id);
            }}
            title={'Qiymət'}
          />
          <View style={{ margin: 10 }} />
          <Input
            placeholder={"Telefon"}
            width={'70%'}
            type={'number'}
            value={document.Phone}
            onChange={(e) => {
              handleChange('Phone', e)
            }}
          />
          <View style={{ margin: 10 }} />
          <Input
            placeholder={'Kart'}
            width={'70%'}
            type={'number'}
            value={document.Card}
            onChange={(e) => {
              handleChange("Card", e)
            }}
            rightIcon={
              <IconButton size={25} onPress={fetchingBarCode}>
                <Ionicons name='sync' size={25} color={theme.black} />
              </IconButton>
            }
          />
          <View style={{ margin: 10 }} />
          <Input
            placeholder={'Endirim %'}
            width={'70%'}
            type={'number'}
            value={document.Discount}
            onChange={(e) => {
              handleChange('Discount', e)
            }}
          />
          <View style={{ margin: 10 }} />
          <Input
            placeholder={'Bonus'}
            width={'70%'}
            type={'number'}
            value={document.Bonus}
            onChange={(e) => {
              handleChange('Bonus', e)
            }}
          />
          <View style={{ margin: 10 }} />
          <Input
            placeholder={'Email'}
            width={'70%'}
            type={'string'}
            value={document.Mail}
            onChange={(e) => {
              handleChange('Mail', e)
            }}
          />

        </View>
      </ManageCard>

      <CustomerGroupsModal modalVisible={groupModal} setModalVisible={setGrouoModal} setProduct={setDocument} />
      <PricesModal modalVisible={pricesModal} setModalVisible={setPricesModal} setProduct={setDocument} />
    </>
  )
}

export default MainCard

