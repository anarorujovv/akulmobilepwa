import React, { useEffect, useState } from 'react';
import useTheme from '../theme/useTheme';
import ManageHeader from './ManageHeader';
import Input from './Input';
import { formatPrice } from '../../services/formatPrice';
import Button from './Button';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import pricingUtils from '../../services/pricingUtils';
import applyDiscount from './../../services/report/applyDiscount';
import PricesModal from './modals/PricesModal';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import api from '../../services/api';
import ListItem from './list/ListItem';
import MySelection from './MySelection';
import PositionManageHeader from './PositionManageHeader';
import useGlobalStore from '../data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import playSound from '../../services/playSound';

const InventoryPositionManage = ({ route, navigation }) => {

  let { product, state, setState, units, type, setUnits } = route?.params || {};

  let [data, setData] = useState({});
  let [priceModal, setPriceModal] = useState(false);
  let [priceName, setPriceName] = useState("");

  const permissions = useGlobalStore(state => state.permissions);

  let theme = useTheme();

  const styles = {
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.bg,
      height: '100vh',
      overflow: 'hidden'
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 20,
      height: 'calc(100vh - 55px)', // Header yüksekliğini çıkar
      overflowY: 'auto'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 10
    },
    text: {
      color: theme.black,
      margin: 0
    },
    margin20: {
      margin: 20
    },
    margin10: {
      margin: 10
    },
    quantityControl: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center'
    },
    loadingCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%'
    },
    diffContainer: {
      flexDirection: 'row',
      gap: 5,
      justifyContent: "center",
      alignItems: 'center',
      display: 'flex'
    }
  };

  const loadInitalData = async () => {
    if (!product) return;

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
      token: await AsyncStorageWrapper.getItem('token'),
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
    // playSound('bc');
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
    // setUnits // Bu satır orijinal kodda yarım kalmış gibi, kaldırdım.
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
      token: await AsyncStorageWrapper.getItem('token')
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

  if (!product && Object.keys(data).length === 0) {
    return <div style={styles.loadingCenter}>Məlumat tapılmadı</div>
  }

  return (
    Object.keys(data).length == 0 ?
      <div style={styles.loadingCenter}>
        <div className="spinner"></div>
      </div>
      :
      <div style={styles.container}>
        <PositionManageHeader
          handleSave={handleSave}
          loading={false}
          navigation={navigation}
          updateText={'Təsdiqlə'}
          createText={'Təsdiqlə'}
        />
        <div style={styles.contentContainer}>

          <div>
            <ListItem index={1} firstText={data.Name} centerText={data.BarCode} endText={data.StockQuantity} />
            <div style={{
              width: '100%',
              marginTop: 20
            }}>
              <div>

                <div style={styles.row}>
                  <span style={styles.text}>Fərq</span>
                  <div style={styles.diffContainer}>
                    <span>{formatPrice(data.Difference)}</span>
                  </div>
                </div>

                {/* cost price */}

                {
                  permission_ver(permissions, 'profit', 'D') &&
                    data.CostPrice ?
                    <div style={styles.row}>
                      <span style={styles.text}>Mayası</span>
                      <span style={styles.text}>{formatPrice(data.CostPrice)}</span>
                    </div>
                    :
                    ""
                }

                {/* Min price */}

                {
                  data.MinPrice ?
                    <div style={styles.row}>
                      <span style={styles.text}>Min.Qiymət</span>
                      <span style={styles.text}>{formatPrice(data.MinPrice)}</span>
                    </div>
                    :
                    ""
                }

              </div>
            </div>


          </div>

          <div>

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

                  <div style={styles.margin10} />
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

            <div style={styles.margin20} />

            <div style={{
              display: 'flex',
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
            </div>

            <div style={styles.margin20} />

            <div style={styles.quantityControl}>
              <Button disabled={data.Quantity == 1} onClick={() => {
                handleChangeQuantity(Number(data.Quantity) - 1);
              }} width={'30%'} icon={<AiOutlineMinusSquare size={35} />} />
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
              }} width={'30%'} icon={<AiOutlinePlusSquare size={35} />} />
            </div>
          </div>

        </div>

        {
          type == 0 ?
            <PricesModal modalVisible={priceModal} setModalVisible={setPriceModal} pressable={handleChangePriceType} setProduct={setData} />
            :
            ""
        }
      </div>
  )
}

export default InventoryPositionManage;
