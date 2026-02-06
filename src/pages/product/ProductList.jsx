import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import ProductListItem from '../../shared/ui/list/ProductListItem';
import Line from '../../shared/ui/Line';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import FabButton from '../../shared/ui/FabButton';
import MyPagination from './../../shared/ui/MyPagination';
import prompt from '../../services/prompt';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Məhsul Siyahısı Komponenti
 * 
 * @component ProductList
 * @param {Object} props - Komponent parametrləri
 * @param {Object} props.route - React Navigation route obyekti
 * @param {Object} props.navigation - React Navigation navigation obyekti
 * 
 * @description
 * Bu komponent məhsulların siyahısını göstərir və idarə edir.
 * Məhsulları əlavə etmək, silmək, redaktə etmək və axtarmaq funksionallığını təmin edir.
 */

const ProductList = ({ route, navigation }) => {

  let permissions = useGlobalStore(state => state.permissions);

  const [products, setProducts] = useState([]);
  const [itemSize, setItemSize] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState('products');

  let theme = useTheme();

  let selectionData = [
    {
      value: {
      },
      selected: '0',
      name: 'Məhsullar'
    },
    {
      value: {
        endpoint: 'kits',
      },
      selected: '1',
      name: 'Dəstlər'
    },
    {
      value: {
        isservice: true
      },
      selected: "2",
      name: "Xidmətlər"
    },
    {
      value: {
        isparty: true
      },
      selected: '3',
      name: 'Partiyalar'
    },
    {
      value: {
        ismediary: true,
      },
      selected: '4',
      name: 'Komisyonlar'
    },
    {
      value: {
        ismanufacture: true
      },
      selected: '5',
      name: 'İsthesal'
    }
  ]

  const styles = StyleSheet.create({
    addButtonContainer: {
      width: 60,
      height: 60,
      borderRadius: 70,
      backgroundColor: theme.pink,
      position: 'absolute',
      bottom: 30,
      right: 20,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    },
    addButton: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center'
    },
    deleteButton: {
      backgroundColor: theme.red,
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: '100%',
    },
    deleteText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    }
  });

  let [filter, setFilter] = useState({
    dr: 0,
    sr: "Name",
    pg: 1,
    gp: "",
    lm: 50,
    ar: 0,
    fast: ""
  })

  /**
   * Məhsul məlumatlarını serverdən alan funksiya
   * @async
   * @function fetchingProductsData
   * @description Səhifələmə və filter parametrlərinə əsasən məhsul məlumatlarını gətirir
   */

  const fetchingProductsData = async () => {
    setIsRefreshing(true);
    let data = {
      ...filter,
      pg: filter.pg - 1,
      token: await AsyncStorage.getItem('token')
    }


    await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/get.php`, data).then(element => {
      if (element != null) {
        setItemSize(element.Count)
        setProducts([...element.List]);
      }
    }).catch(err => {
      ErrorMessage(err)
    }).finally(() => {
      setIsRefreshing(false);
    })
  }

  /**
   * Məhsul axtarışı üçün funksiya
   * @async
   * @function fetchingProductsSearchData
   * @description Sürətli axtarış üçün məhsul məlumatlarını gətirir
   */
  const fetchingProductsSearchData = async () => {
    let data = {
      ...filter,
      pg: filter.pg - 1,
      token: await AsyncStorage.getItem('token'),
    }
    await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/getfast.php`, data).then(element => {
      if (element != null) {
        setProducts([...element.List]);
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  /**
   * Məhsulu silmək üçün funksiya
   * @async
   * @function handleDelete
   * @param {number} itemId - Silinəcək məhsulun ID-si
   * @description İstifadəçinin icazəsi varsa məhsulu sistemdən silir
   */

  const handleDelete = async (itemId) => {
    if (permission_ver(permissions, 'sub_product', 'D')) {
      await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/del.php?id=${itemId}`, {
        token: await AsyncStorage.getItem("token")
      }).then(element => {
        if (element != null) {
          SuccessMessage("Silindi");
          setProducts([])
          reload();
        }
      }).catch(err => {
        ErrorMessage(err)
      })
    } else {
      ErrorMessage('İcazə yoxdur!')
    }
  };

  /**
   * Məhsul elementini render edən funksiya
   * @function renderItem
   * @param {Object} params - Render parametrləri
   * @param {Object} params.item - Məhsul məlumatları
   * @param {number} params.index - Elementin indeksi
   * @returns {JSX.Element} Məhsul elementi
   */

  const renderItem = ({ item, index }) => (
    <>
      <ProductListItem
        iconCube={true}
        onLongPress={() => {
          prompt('Məhsulu silməyə əminsiniz?', () => {
            handleDelete(item.Id);
          })
        }}
        onPress={() => {
          if (permission_ver(permissions, 'sub_product', "U")) {
            navigation.navigate('product-manage', { id: item.Id })
          } else {
            ErrorMessage("İcazə yoxdur!");
          }
        }}
        key={item.Id}
        product={item}
      />
      <Line width={'90%'} />
    </>
  );

  /**
   * Scanner səhifəsinə keçid funksiyası
   * @function handleScanner
   * @description Barkod scanner səhifəsinə yönləndirir
   */

  const handleScanner = () => {
    navigation.navigate('product-scanner', {
      setData: (e) => {
        setFilter(rel => ({ ...rel, fast: e }));
      }
    });
  };

  /**
   * Məlumatları yeniləmək üçün funksiya
   * @function reload
   * @description Axtarış vəziyyətinə görə məlumatları yeniləyir
   */
  const reload = () => {
    if (filter.fast === "") {
      fetchingProductsData();
    } else {
      fetchingProductsSearchData();
    }
  }

  /**
   * Səhifələmə komponenti
   * @function FooterComponent
   * @returns {JSX.Element} Səhifələmə elementi
   */
  const FooterComponent = () => {
    return (
      products.length == 50 || page != 1 ?
        <MyPagination
          pageSize={50}
          itemSize={itemSize}
          page={filter.pg}
          setPage={(e) => {
            setFilter(rel => ({ ...rel, pg: e }));
          }}
        />
        :
        ""
    )
  }

  useFocusEffect(
    useCallback(() => {
      let time;
      setProducts(null);

      if (filter.fast === "") {
        fetchingProductsData();
      } else {
        time = setTimeout(() => {
          fetchingProductsSearchData();
        }, 400);
      }

      return () => clearTimeout(time);
    }, [filter])
  )

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>

      <ListPagesHeader
        processScannerClick={handleScanner}
        header={"Məhsullar"}
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'fast'}
        isFilter={true}
        processFilterClick={() => {
          navigation.navigate('filter', {
            filter: filter,
            setFilter: setFilter,
            searchParams: [
              'productName',
              'barCode',
              'groups',
              'artCode',
              'owners',
              'customers',
            ],
            customFields: {
              groups: {
                title: "Qrup",
                name: 'gp',
                api: 'productfolders',
                type: 'select'
              }
            },
            sortList: [
              {
                id: 1,
                label: "Ad",
                value: 'Name'
              },
              {
                id: 2,
                label: "Barkod",
                value: 'BarCode'
              },
              {
                id: 3,
                label: "Qrup",
                value: 'GroupName'
              },
              {
                id: 4,
                label: "Alış qiyməti",
                value: "BuyPrice"
              },
              {
                id: 5,
                label: "Satış qiyməti",
                value: "Price"
              },
              {
                id: 6,
                label: 'Təchizatçı',
                value: 'CustomerName'
              },
              {
                id: 7,
                label: 'Anbar qalığı',
                value: 'StockBalance'
              }
            ]
          });
        }}
      />

      <Picker
        selectedValue={selected}
        onValueChange={(e, t) => {
          setSelected(e);
          let myFilter = { ...filter, };
          delete myFilter.endpoint;
          delete myFilter.ismanufacture;
          delete myFilter.isservice;
          delete myFilter.isparty;
          delete myFilter.ismediary;
          delete myFilter.ismanufacture;


          myFilter = { ...myFilter, ...selectionData[Number(e)].value }

          setFilter(myFilter);
        }}
      >
        {
          selectionData.map((element, index) => {
            return (
              <Picker.Item key={element.selected} value={element.selected} color={theme.black} label={element.name} />
            )
          })
        }
      </Picker>

      {
        products == null ?
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ActivityIndicator size={30} color={theme.primary} />
          </View>
          :
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.Id.toString()}
            refreshing={isRefreshing}

            onRefresh={() => {
              if (filter.fast != '') {
                fetchingProductsSearchData();
              } else {
                fetchingProductsData();
              }
            }}

            ListFooterComponent={FooterComponent}
          />
      }

      <FabButton onPress={() => {
        if (permission_ver(permissions, 'sub_product', 'C')) {
          navigation.navigate('product-manage', { id: null });
        } else {
          ErrorMessage('İcazə yoxdur!');
        }
      }} />
    </View>
  );
};

export default ProductList;
