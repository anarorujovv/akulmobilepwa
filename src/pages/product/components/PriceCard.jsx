import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import useTheme from '../../../shared/theme/useTheme'
import Input from '../../../shared/ui/Input'
import { ProductGlobalContext } from '../../../shared/data/ProductGlobalState'
import Entypo from 'react-native-vector-icons/Entypo';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore'
import permission_ver from '../../../services/permissionVerification'

const PriceCard = ({ changeInput }) => {

  let { product } = useContext(ProductGlobalContext);
  const permissions = useGlobalStore(state => state.permissions);

  let theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      elevation: 2,
      shadowColor: theme.black,
      backgroundColor: theme.bg,
      alignItems: 'center',
      paddingBottom: 50
    },
    header: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      padding: 15
    },
    center: {
      gap: 10
    }
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Entypo size={20} color={theme.grey} name='price-tag' />
        <Text style={{
          color: theme.grey
        }}>Qiymət</Text>
      </View>
      <View style={styles.center}>

        <Input
          placeholder={"Satış qiymət"}
          value={product.Price}
          width={'70%'}
          type={'number'}
          onChange={(e) => {
            changeInput('Price', e);
          }} />

        {
          permission_ver(permissions, 'sub_buy_price', 'R') ?
          <Input
            type={'number'}
            placeholder={"Alış qiymət"}
            value={product.BuyPrice}
            width={'70%'}
            onChange={(e) => {
              changeInput('BuyPrice', e)
            }}
          />
          :
        ""
        }

        <Input
          type={'number'}
          placeholder={"Minimal qiymət"}
          value={product.MinPrice}
          width={'70%'}
          onChange={(e) => {
            changeInput('MinPrice', e);
          }}
        />

      </View>
    </View>
  )
}

export default PriceCard
