import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ProductGlobalContext } from './../../shared/data/ProductGlobalState';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../../shared/theme/useTheme';
import BasicCard from './components/BasicCard';
import PriceCard from './components/PriceCard';
import PriceTypesCard from './components/PriceTypesCard';
import StockAndStatusCard from './components/StockAndStatusCard';
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from './../../shared/ui/RepllyMessage/SuccessMessage';
import ManageHeader from '../../shared/ui/ManageHeader';
import Button from '../../shared/ui/Button';
import prompt from './../../services/prompt';
import { useFocusEffect } from '@react-navigation/native';
import DestinationCard from '../../shared/ui/DestinationCard';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import buildModificationsPayload from '../../services/buildModificationsPayload';
import playSound from '../../services/playSound';

/**
 * Məhsul İdarəetmə Komponenti
 * 
 * @component ProductManage
 * @param {Object} props - Komponent parametrləri
 * @param {Object} props.route - React Navigation route obyekti
 * @param {Object} props.navigation - React Navigation navigation obyekti
 * 
 * @description
 * Bu komponent məhsulun ətraflı məlumatlarını idarə etmək üçün istifadə olunur.
 * Məhsulun əsas məlumatları, qiymətləri, anbar vəziyyəti və statusunu redaktə etmək imkanı verir.
 */

const ProductManage = ({ route, navigation }) => {
  let { id } = route.params;

  let theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.whiteGrey
    },
    top: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10
    },
    text: {
      fontSize: 18,
      color: theme.stable.white
    }
  })


  const { product, setProduct } = useContext(ProductGlobalContext);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [priceTypes, setPriceTypes] = useState([]);


  /**
   * Fiyat tiplerini serverdən alan funksiya
   * @async
   * @function fetchPriceTypes
   * @description Fiyat tiplerini getiren API çağrısı
   */
  const fetchPriceTypes = async () => {
    try {
      let obj = {
        token: await AsyncStorage.getItem('token')
      }

      await api('pricetypes/get.php', obj).then(data => {
        if (data && data.List) {
          // 9999, 9998, 9997, 9996 ID'li fiyat tiplerini filtreleme
          const filteredPriceTypes = data.List.filter(type =>
            type.Id !== 9999 && type.Id !== 9998 && type.Id !== 9997 && type.Id !== 9996
          );
          setPriceTypes(filteredPriceTypes);
        }
      }).catch(err => {
        ErrorMessage(err);
      });
    } catch (error) {
      ErrorMessage("Fiyat tipleri alınırken hata oluştu!");
    }
  };

  /**
   * Məhsul məlumatlarını serverdən alan funksiya
   * @async
   * @function fetchingProduct
   * @param {number|null} id - Məhsulun ID-si (yeni məhsul üçün null)
   * @description Məhsul ID-sinə əsasən məlumatları gətirir və ya yeni məhsul üçün default dəyərləri təyin edir
   */
  const fetchingProduct = async (id) => {

    if (id == null) {
      let defaultInfo = {
        VatTypeChecked: true,
        Name: "",
        GroupId: "",
        GroupName: "",
        IsMinQuantity: 1,
        BarCode: "",
        ArtCode: "",
        Modifications: [{}],
        Prices: [],
        IsArch: 0,
        IsWeight: 0,
        CustomerName: "",
        CustomerId: "",
        BuyPrice: 0,
        Price: 0,
        MinPrice: 0,
        Images: [],
        Quantity: 0
      }


      setProduct(defaultInfo);
    } else {
      let obj = {
        id: id,
        token: await AsyncStorage.getItem('token')
      }

      await api('products/get.php', obj).then(item => {
        if (item != null) {
          let prData = { ...item.List[0] };

          prData.Price = String(formatPrice(prData.Price))
          prData.BuyPrice = String(formatPrice(prData.BuyPrice))
          prData.MinPrice = String(formatPrice(prData.MinPrice))
          if (!prData.Modifications[0]) {
            prData.Modifications = [{}];
          }
          setProduct(prData)
        }
      }).catch(err => {
        ErrorMessage(err)
      })
    }
  }

  /**
   * Məhsul məlumatlarını yadda saxlayan funksiya
   * @async
   * @function handleSave
   * @description Məhsul məlumatlarını yoxlayır və serverə göndərir
   */
  const handleSave = async () => {

    setLoading(true)

    let productData = { ...product }
    let data = formatObjectKey(productData);

    if (data.name == "" || data.groupid == "") {
      ErrorMessage("Vacib xanaları doldurun!")
    } else {
      data.token = await AsyncStorage.getItem('token');

      if (data.barcode == "") {
        await api('barcode/get.php', {
          w: 0,
          token: await AsyncStorage.getItem('token')
        }).then(element => {
          if (element != null) {
            data.barcode = element;
          }
        }).catch(err => {
          ErrorMessage(err)
        })
      }

      data.modifications = await buildModificationsPayload(data.modifications[0], 'product');
      await api('products/put.php', data).then(
        (element) => {
          if (element != null) {
            SuccessMessage("Yadda Saxlanıldı");
            fetchingProduct(element.ResponseService);
            setHasUnsavedChanges(false);
            playSound('success');
          }
        }
      ).catch(
        (err) => {
          ErrorMessage(err);
        }
      )
    }

    setLoading(false)
  }

  /**
   * Dəyişiklik vəziyyətini yeniləyən funksiya
   * @function handleChangeFromHasUnsavedChangesState
   * @description Məhsulda dəyişiklik edildiyini qeyd edir
   */
  const handleChangeFromHasUnsavedChangesState = () => {
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
  }

  /**
   * Input dəyişikliyini idarə edən funksiya
   * @function handleChangeInput
   * @param {string} key - Dəyişdirilən sahənin adı
   * @param {any} value - Yeni dəyər
   * @description Input dəyişikliklərini məhsul state-ində yeniləyir
   */
  const handleChangeInput = (key, value) => {
    setProduct(rel => ({ ...rel, [key]: value }));
    handleChangeFromHasUnsavedChangesState();
  }

  /**
   * Fiyat tipi değişikliklerini yönetir
   * @function handlePriceTypeChange
   * @param {number} priceTypeId - Değiştirilen fiyat tipinin ID'si
   * @param {string} value - Yeni değer
   */
  const handlePriceTypeChange = (priceTypeId, value) => {
    const updatedProduct = { ...product };

    // Mevcut fiyat tipi var mı kontrol et
    const existingPriceIndex = updatedProduct.Prices.findIndex(
      price => price.PriceType === parseInt(priceTypeId)
    );

    if (existingPriceIndex !== -1) {
      // Varsa güncelle
      updatedProduct.Prices[existingPriceIndex].Price = value;
    } else {
      // Yoksa yeni ekle
      updatedProduct.Prices.push({
        PriceType: parseInt(priceTypeId),
        Price: value
      });
    }

    setProduct(updatedProduct);
    handleChangeFromHasUnsavedChangesState();
  };

  /**
   * Seçim dəyişikliyini idarə edən funksiya
   * @function handleChangeSelection
   * @description Seçim dəyişikliklərini qeyd edir
   */
  const handleChangeSelection = () => {
    handleChangeFromHasUnsavedChangesState();
  }

  useEffect(() => {
    fetchingProduct(id);
    fetchPriceTypes();
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
        print={'products'}
        document={product}
        type={'product'}
      />
      {
        product === null ?
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
              <View style={{
                width: '100%',
                gap: 20,
                marginBottom: 20
              }}>
                <BasicCard navigation={navigation} changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
                <PriceCard changeInput={handleChangeInput} id={id} />
                <PriceTypesCard
                  priceTypes={priceTypes}
                  productPrices={product.Prices || []}
                  changePriceType={handlePriceTypeChange}
                />
                <StockAndStatusCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
                <DestinationCard
                  document={product}
                  setDocument={setProduct}
                  changeInput={handleChangeInput}
                  changeSelection={handleChangeSelection}
                />
                <ModificationsCard
                  target={'product'}
                  hasUnsavedChanged={setHasUnsavedChanges}
                  setState={setProduct}
                  state={product}
                />
              </View>
            </ScrollView>
            {
              hasUnsavedChanges ?
                <Button
                  bg={theme.green}
                  isLoading={loading}
                  onClick={handleSave}
                  disabled={loading}
                >Yadda Saxla</Button>
                :
                ""
            }
          </>
      }
    </View>
  )
}

export default ProductManage
