import { StyleSheet, Text, View, CheckBox, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import { ProductGlobalContext } from '../../../shared/data/ProductGlobalState'
import Input from './../../../shared/ui/Input';
import useTheme from '../../../shared/theme/useTheme';
import IconButton from '../../../shared/ui/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import Selection from './../../../shared/ui/Selection';

const BasicCard = ({ navigation, id, changeInput, changeSelection }) => {

  const { product, setProduct } = useContext(ProductGlobalContext);
  const theme = useTheme();


  const styles = StyleSheet.create({
    container: {
      width: '100%',
      elevation: 2,
      shadowColor: theme.black,
      backgroundColor: theme.bg,
      alignItems: 'center',
      paddingBottom: 25
    },
    imageContainer: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center'
    },
    bottomContainer: {
      alignItems: 'center',
      width: '100%',
      gap: 10
    }
  })

  const handleBarcodeGenerate = async () => {
    await api('barcode/get.php', {
      w: 0,
      token: await AsyncStorage.getItem('token')
    }).then(element => {
      if (element != null) {
        setProduct(rel => ({ ...rel, ['BarCode']: String(element) }));
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  const handleScanner = async () => {
    navigation.navigate('product-scanner', {
      setData: (e) => {
        setProduct(rel => ({ ...rel, BarCode: e }));
      }
    });
  }


  return (
    <View style={styles.container}>
      <View style={{
        width: '100%',
        padding: 15,
      }}>
        <Text style={{
          fontSize: 20,
          color: theme.primary
        }}>Məhsul Və Xidmətlər</Text>
      </View>
      <View style={styles.bottomContainer}>

        <Input value={product.Name} isRequired={true} onChange={(e) => {
          changeInput('Name', e);
        }} placeholder={'Məhsulun adı'} width={'70%'} />

        <View style={{
          width: '70%',
          display: 'flex',
          flexDirection: "column",
          alignItems: 'flex-start'
        }}>
          <Input disabled={product.IsWeight == 1} onChange={(e) => {
            changeInput('BarCode', e);
          }} type={'number'} value={product.BarCode} placeholder={'Barkod'} width={'75%'}
            rightIcon={
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 20
              }}>
                <IconButton size={25} disabled={product.IsWeight == 1 ? true : false} onPress={handleBarcodeGenerate}>
                  <Ionicons name='sync' size={25} color={product.IsWeight == 1 ? theme.grey : theme.black} />
                </IconButton>
                <IconButton size={25} disabled={product.IsWeight == 1 ? true : false} onPress={handleScanner}>
                  <Ionicons name='scan' size={25} color={product.IsWeight == 1 ? theme.grey : theme.black} />
                </IconButton>
              </View>
            }
          />
        </View>

        <Input value={product.ArtCode} onChange={(e) => {
          changeInput('ArtCode', e);
        }} placeholder={'Artkod'} width={'70%'} />

        <Input value={product.Quantity} onChange={(e) => {
          changeInput('Quantity', e);
        }} placeholder={'İlkin qalıq'} width={'70%'} />

        <Selection
          apiName={'customers/getfast.php'}
          apiBody={{}}
          searchApi={'customers/getfast.php'}
          searchKey={'fast'}
          value={product.CustomerId}
          title={'Təchizatçı'}
          defaultValue={product.CustomerName}
          change={(item) => {
            setProduct(rel => ({ ...rel, ['CustomerId']: item.Id }));
            changeSelection();
          }}
        />

        <Selection
          isRequired={true}
          apiBody={{}}
          apiName={'productfolders/get.php'}
          value={product.GroupId}
          defaultValue={product.GroupName}
          title={'Qrup'}
          change={(item) => {
            setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
            changeSelection();
          }}
        />




      </View>

    </View>
  )
}

export default BasicCard