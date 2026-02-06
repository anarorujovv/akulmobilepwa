import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../theme/useTheme';
import ManageHeader from './ManageHeader';
import Input from './Input';
import { formatPrice } from '../../services/formatPrice';
import Button from './Button';
import AntDesign from 'react-native-vector-icons/AntDesign'
import pricingUtils from '../../services/pricingUtils';
import applyDiscount from './../../services/report/applyDiscount';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PricesModal from './modals/PricesModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import api from '../../services/api';
import ListItem from './list/ListItem';
import MySelection from './MySelection';
import PositionManageHeader from './PositionManageHeader';
import useGlobalStore from '../data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import playSound from '../../services/playSound';

let height = Dimensions.get('window').height;

const InventoryPositionManage = ({ route, navigation }) => {

  let { product, state, setState, units, type, setUnits } = route.params;

  let [data, setData] = useState({});
  let [priceModal, setPriceModal] = useState(false);
  let [priceName, setPriceName] = useState("");

  const permissions = useGlobalStore(state => state.permissions);

  let theme = useTheme();
  const loadInitalData = async (
  ) => {
    let info = { ...product };

    if (!info.Id) {
      info.Price = formatPrice(info.Price)
      info.Quantity = formatPrice(info.Quantity);
      info.Discount = String(formatPrice(100 - (info.Price * 100 / info.BasicPrice)));
      info.AllSum = info.Quantity * info.Price;
    } else {
      let index = [...state.Positions].findIndex(rel => rel.ProductId == info.Id);

      if (index != -1) {
        info = state.Positions[index];
        info.AllSum = String(info.Quantity * info.Price);
        info.Discount = String(formatPrice(100 - (info.Price * 100 / info.BasicPrice)));
        info.Price = formatPrice(info.Price);
      } else {
        info.ProductId = info.Id;
        info.Discount = 0;
        info.ProductId = info.Id;
        info.Discount = 0;
        info.Quantity = 1;

        info.BasicPrice = formatPrice(info.Price);
        info.Price = formatPrice(info.Price)

        info.AllSum = info.Price * info.Quantity;
      }
    }

    let document = { ...state };

    let obj = {
      moment: document.Moment,
      stockid: document.StockId,
      token: await AsyncStorage.getItem('token'),
      productids: [info.ProductId]
    }
    await api('stockbalancebyid/get.php', obj)
      .then(element => {
        if (element != null) {
          if (element.List[0]) {
            info.StockQuantity = formatPrice(element.List[0].Quantity);
          } else {
            info.StockQuantity = '0';
          }
        }
      })
      .catch(err => {
        ErrorMessage(err);
      })
    setData(info);
  }

  const handleSave = () => {
    let propsState = { ...state };
    let stateData = { ...data };

    if (Number(stateData.Price) < Number(stateData.MinPrice)) {
      ErrorMessage("Satış qiymət'i, Minimal qiymətdən az ola bilməz!");
      return;
    }

    setUnits(rel => {
      if (!rel[stateData.ProductId]) {
        rel[stateData.ProductId] = units[stateData.ProductId];
      }
      return rel;
    })

    let index = [...propsState.Positions].findIndex(rel => rel.ProductId == stateData.ProductId);
    if (index == -1) {
      propsState.Positions.push(stateData);
    } else {
      propsState.Positions[index] = stateData;
    }

    setState({ ...propsState, ...(pricingUtils(propsState.Positions)) });
    playSound('bc');
    navigation.goBack();
  }

  const handleChangePrice = (value) => {
    handleChange('Price', value);
    let totalDiscount = (value * 100) / data.BasicPrice;
    handleChange('Discount', formatPrice(totalDiscount));
    handleChange('AllSum', formatPrice(value * data.Quantity))
  }


  const handleChangeDiscount = (value) => {

    handleChange('Discount', value);

    let totalPrice = Number(data.BasicPrice) - ((data.BasicPrice / 100) * value)

    handleChange('Price', formatPrice(totalPrice))
    handleChange('AllSum', formatPrice(totalPrice * Number(data.Quantity)));
  }

  const handleChangeQuantity = (value) => {
    handleChange('Quantity', value);
    handleChange("AllSum", String(formatPrice(value * Number(data.Price))));
    handleChange('Difference', Math.abs(formatPrice(value) - formatPrice(data.StockQuantity)));
  }

  const handleChangeAllSum = (value) => {
    handleChange('AllSum', value);
    let price = value / data.Quantity
    let totalDiscount = (price * 100) / data.BasicPrice
    handleChange('Price', formatPrice(price))
    handleChange('Discount', formatPrice(totalDiscount));
  }

  const handleChange = (name, value) => {
    let text = String(value);
    setData(rel => ({ ...rel, [name]: text }));
  }

  const handleChangeUnit = (value) => {

    let info = { ...data };
    let index = [...units[product.ProductId]].findIndex(rel => rel.Id == value);
    let unit = units[product.ProductId][index];
    setUnits
    info.UnitId = unit.Id;
    info.UnitName = unit.Name;
    info.UnitTitle = unit.Title;
    info.Price = formatPrice(unit.Price);
    info.AllSum = info.Price * info.Quantity;
    info.BasicPrice = formatPrice(unit.Price);

    setData(info);
  }

  const handleChangePriceType = async (item) => {
    setPriceName(item.Name);
    let obj = {
      pricetype: item.Id,
      products: [
        data.ProductId
      ],
      token: await AsyncStorage.getItem('token')
    }

    await api('products/getproductsrate.php', obj).then(res => {
      if (res != null) {
        if (res.List[0]) {
          handleChange('Price', formatPrice(res.List[0].Price));
        } else {
          handleChange('Price', 0);
        }
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  useEffect(() => {
    loadInitalData();
  }, [product])

  return (
    Object.keys(data).length == 0 ?
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={40} color={theme.primary} />
      </View>
      :
      <View style={{
        flex: 1,
        backgroundColor: theme.bg,
      }}>
        <PositionManageHeader
          handleSave={handleSave}
          loading={false}
          navigation={navigation}
          updateText={'Təsdiqlə'}
          createText={'Təsdiqlə'}
        />
        <View style={{
          justifyContent: 'space-between',
          padding: 20,
          height: '95%',
        }}>

          <View>
            <ListItem index={1} firstText={data.Name} centerText={data.BarCode} endText={data.StockQuantity} />
            <View style={{
              width: '100%',
              height: 100,
              marginTop: 20
            }}>
              <View>

                <View style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between'
                }}>
                  <Text style={{ color: theme.black }}>Fərq</Text>
                  <View style={{
                    flexDirection: 'row', gap: 5,
                    justifyContent: "center", alignItems: 'center'
                  }}>
                    <Text>{formatPrice(data.Difference)}</Text>
                  </View>
                </View>

                {/* cost price */}

                {
                  permission_ver(permissions, 'profit', 'D') &&
                    data.CostPrice ?
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                      <Text style={{ color: theme.black }}>Mayası</Text>
                      <Text style={{ color: theme.black }}>{formatPrice(data.CostPrice)}</Text>
                    </View>
                    :
                    ""
                }

                {/* Min price */}

                {
                  data.MinPrice ?
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                      <Text style={{ color: theme.black }}>Min.Qiymət</Text>
                      <Text style={{ color: theme.black }}>{formatPrice(data.MinPrice)}</Text>
                    </View>
                    :
                    ""
                }

              </View>
            </View>


          </View>

          <View>

            {
              units ?
                <>

                  <MySelection
                    label={'Vahid'}
                    value={data.UnitId}
                    onValueChange={handleChangeUnit}
                    list={units[data.ProductId]}
                    labelName={'Name'}
                    valueName={'Id'}
                  />

                  <View style={{ margin: 10 }} />
                </>
                :
                ""
            }

            <Input
              placeholder={'Məbləğ'}
              value={data.AllSum}
              width={'100%'}
              type={'number'}
              onChange={(e) => {
                handleChangeAllSum(e);
              }}
            />

            <View style={{ margin: 20 }} />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              <Input
                placeholder={'Endirim'}
                value={data.Discount}
                width={'45%'}
                type={'number'}
                onChange={(e) => {
                  handleChangeDiscount(e);
                }}
              />

              <Input
                labelButton={true}
                onPressLabelButton={() => {
                  setPriceModal(true);
                }}
                placeholder={priceName == '' ? 'Satış qiyməti' : priceName}
                value={data.Price}
                width={'45%'}
                type={'number'}
                onChange={(e) => {
                  handleChangePrice(String(e))
                }}
              />
            </View>

            <View style={{ margin: 20 }} />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center'
            }}>
              <Button disabled={data.Quantity == 1} onClick={() => {
                handleChangeQuantity(Number(data.Quantity) - 1);
              }} width={'30%'} icon={<AntDesign size={35} name='minussquareo' />} />
              <Input
                txPosition={'center'}
                placeholder={'Faktiki qalıq'}
                value={data.Quantity}
                type={'number'}
                onChange={(e) => {
                  handleChangeQuantity(e)
                }}
                width={'30%'}
              />

              <Button onClick={() => {
                handleChangeQuantity(Number(data.Quantity) + 1);
              }} width={'30%'} icon={<AntDesign size={35} name='plussquareo' />} />
            </View>
          </View>

        </View>

        {
          type == 0 ?
            <PricesModal modalVisible={priceModal} setModalVisible={setPriceModal} pressable={handleChangePriceType} setProduct={setData} />
            :
            ""
        }
      </View>
  )
}

export default InventoryPositionManage

const styles = StyleSheet.create({})
