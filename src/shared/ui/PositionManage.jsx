import { ActivityIndicator, StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import useTheme from '../theme/useTheme';
import Input from './Input';
import { formatPrice } from '../../services/formatPrice';
import Button from './Button';
import AntDesign from 'react-native-vector-icons/AntDesign'
import pricingUtils from '../../services/pricingUtils';
import applyDiscount from './../../services/report/applyDiscount';
import PricesModal from './modals/PricesModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import api from '../../services/api';
import ListItem from './list/ListItem';
import MySelection from './MySelection';
import PositionManageHeader from './PositionManageHeader';
import findUnitById from './../../services/report/findUnitById';
import useGlobalStore from '../data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import playSound from '../../services/playSound';

const PositionManage = ({ route, navigation }) => {

  let { product, state, setState, units, type, setUnits, setHasUnsavedChanges, pricePermission = true } = route.params;

  const permissions = useGlobalStore(state => state.permissions);

  let [data, setData] = useState({});
  let [priceModal, setPriceModal] = useState(false);
  let [priceName, setPriceName] = useState("");

  const scrollViewRef = useRef(null);

  let theme = useTheme();
  const loadInitalData = async () => {
    let info = { ...product };
    let document = { ...state };

    if (!info.Id) {
      if (type == 1) {
        info.TargetSalePrice = info.SalePrice;
      }
      info.Price = formatPrice(info.Price)
      info.Quantity = formatPrice(info.Quantity);
      info.AllSum = info.Quantity * info.Price;

      if (info.BasicPrice) {
        info.Discount = String(formatPrice(100 - (info.Price * 100 / info.BasicPrice)));
      }

    } else {
      info.ProductId = info.Id;
      info.ProductId = info.Id;
      info.Discount = 0;
      info.Quantity = 1;
      delete info.Id;

      const unit = findUnitById(info, units);

      if (type == 1) {
        info.TargetSalePrice = info.Price;
        info.Price = formatPrice(info.BuyPrice);
        info.BasicPrice = info.Price;
      } else {
        info.BasicPrice = formatPrice(info.Price);
        info.Price = formatPrice(info.Price)
      }


      if (type == 1) {
        info.Price = formatPrice(unit.BuyPrice);
        info.BasicPrice = formatPrice(unit.BuyPrice);
      } else {
        info.Price = formatPrice(unit.Price);
        info.BasicPrice = formatPrice(unit.Price);
      }

      info.AllSum = info.Price * info.Quantity;

      if (document.CustomerId) {
        if (document.CustomerInfo?.CustomerData?.PriceTypeId != 0 && document.CustomerInfo?.CustomerData?.PriceTypeId != 9998) {
          info.Price = formatPrice(info.SelectedTypePrice);
          info.BasicPrice = formatPrice(info.SelectedTypePrice);
        }

        if (document.CustomerId !== "") {
          let discount = formatPrice(document.CustomerInfo.CustomerData.Discount)
          info.Price = formatPrice(applyDiscount(info.BasicPrice, discount))
          info.Discount = formatPrice(discount)
        }

        info.AllSum = formatPrice(info.Price) * formatPrice(info.Quantity);
      }

    }

    if (document.StockId) {
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
    }
    setData(info);
  }

  const handleSave = () => {
    let propsState = { ...state };
    let stateData = { ...data };

    // if (permission_ver(permissions, 'below_minprice', 'R')) {
    //   if (type != 1 && Number(stateData.Price) < Number(stateData.MinPrice)) {
    //     ErrorMessage("Satış qiyməti, Minimal qiymətdən az ola bilməz!");
    //     return;
    //   }
    // }

    let unitInfos = { ...units };
    if (!unitInfos[stateData.ProductId]) {
      unitInfos[stateData.ProductId] = units[stateData.ProductId];
    }
    setUnits(unitInfos);

    let index = [...propsState.Positions].findIndex(rel => rel.ProductId == stateData.ProductId);
    if (index == -1) {
      propsState.Positions.push(stateData);
    } else {
      propsState.Positions[index] = stateData;
    }
    playSound('bc');
    setState({ ...propsState, ...(pricingUtils(propsState.Positions)) });
    setHasUnsavedChanges(true);
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
    info.UnitId = value;

    const unit = findUnitById(info, units);

    info.UnitId = unit.Id;
    info.UnitName = unit.Name;
    info.UnitTitle = unit.Title;

    if (type == 1) {
      info.Price = formatPrice(unit.BuyPrice);
      info.AllSum = formatPrice(info.Price) * formatPrice(info.Quantity);
      info.BasicPrice = formatPrice(unit.BuyPrice);
    } else {
      info.Price = formatPrice(unit.Price);
      info.AllSum = formatPrice(info.Price) * formatPrice(info.Quantity);
      info.BasicPrice = formatPrice(unit.Price);
    }

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
        let doc = { ...data };
        if (res.List[0]) {
          doc.Price = formatPrice(res.List[0].Price);
          doc.BasicPrice = formatPrice(res.List[0].Price);
          doc.Discount = formatPrice(0);
        } else {
          doc.Price = formatPrice(0);
          doc.BasicPrice = formatPrice(0);
          doc.Discount = formatPrice(0);
        }
        setData(doc);
      }

    }).catch(err => {
      ErrorMessage(err)
    })
  }

  useEffect(() => {
    loadInitalData();
  }, [product])

  // Keyboard event listener - klavye açıldığında scroll'u en alta kaydır
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{
              justifyContent: 'space-between',
              padding: 20,
              flex: 1,
              minHeight: 500 // Increased min height to enable scrolling
            }}>

              <View>
                <ListItem index={1} firstText={data.Name} centerText={data.BarCode} endText={data.StockQuantity} />
                <View style={{
                  width: '100%',
                  height: 100,
                  marginTop: 20
                }}>
                  <View>

                    {
                      pricePermission ?
                        permission_ver(permissions, 'profit', 'D') &&
                          data.CostPrice ?
                          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.black }}>Mayası</Text>
                            <Text style={{ color: theme.black }}>{formatPrice(data.CostPrice)}</Text>
                          </View>
                          :
                          ""
                        :
                        ""
                    }

                    {
                      data.TargetSalePrice ?
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                          <Text style={{ color: theme.black }}>Satış qiyməti</Text>
                          <Text style={{ color: theme.black }}>{formatPrice(data.TargetSalePrice)}</Text>
                        </View>
                        :
                        ''
                    }

                  </View>
                </View>


              </View>

              <View>

                {
                  units[data.ProductId] ?
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


                {
                  pricePermission ? <Input
                    placeholder={'Məbləğ'}
                    value={data.AllSum}
                    width={'100%'}
                    type={'number'}
                    onChange={(e) => {
                      handleChangeAllSum(e);
                    }}
                  />
                    :
                    ""
                }

                {
                  pricePermission ? <View style={{ margin: 20 }} />
                    :
                    ""
                }

                {
                  pricePermission ?
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}>
                      {
                        state.BasicAmount != undefined ?
                          <Input
                            placeholder={'Endirim'}
                            value={data.Discount}
                            width={'45%'}
                            type={'number'}
                            onChange={(e) => {
                              handleChangeDiscount(e);
                            }}
                          />
                          :
                          ""
                      }

                      <Input
                        labelButton={type == 0 ? true : false}
                        onPressLabelButton={() => {
                          setPriceModal(true);
                        }}
                        placeholder={priceName == '' ? type == 0 ? 'Satış qiyməti' : "Alış qiyməti" : priceName}
                        value={data.Price}
                        width={state.BasicAmount ? '45%' : '100%'}
                        type={'number'}
                        onChange={(e) => {
                          handleChangePrice(String(e))
                        }}
                      />
                    </View>
                    :
                    ""
                }

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
                    placeholder={'Miqdar'}
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
          </ScrollView>
        </KeyboardAvoidingView>

        {
          type == 0 ?
            <PricesModal modalVisible={priceModal} setModalVisible={setPriceModal} pressable={handleChangePriceType} setProduct={setData} />
            :
            ""
        }
      </View>
  )
}

export default PositionManage

const styles = StyleSheet.create({})
