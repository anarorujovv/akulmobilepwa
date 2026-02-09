import React, { useCallback, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import ProductListItem from '../../shared/ui/list/ProductListItem';
import Line from '../../shared/ui/Line';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
import FabButton from '../../shared/ui/FabButton';
import MyPagination from './../../shared/ui/MyPagination';
import { useNavigate, useLocation } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
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

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex'
    },
    listContainer: {
      flex: 1,
      overflowY: 'auto',
      paddingBottom: 80
    },
    selectContainer: {
      padding: '10px',
      backgroundColor: theme.bg
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid ${theme.input.border}`,
      backgroundColor: theme.input.bg,
      color: theme.text,
      fontSize: '16px'
    }
  };

  let [filter, setFilter] = useState({
    dr: 0,
    sr: "Name",
    pg: 1,
    gp: "",
    lm: 50,
    ar: 0,
    fast: ""
  })

  const fetchingProductsData = async () => {
    setIsRefreshing(true);
    let data = {
      ...filter,
      pg: filter.pg - 1,
      token: await AsyncStorageWrapper.getItem('token')
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

  const fetchingProductsSearchData = async () => {
    let data = {
      ...filter,
      pg: filter.pg - 1,
      token: await AsyncStorageWrapper.getItem('token'),
    }
    await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/getfast.php`, data).then(element => {
      if (element != null) {
        setProducts([...element.List]);
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  const handleDelete = async (itemId) => {
    if (permission_ver(permissions, 'sub_product', 'D')) {
      let data = { ...filter };
      await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/del.php?id=${itemId}`, {
        token: await AsyncStorageWrapper.getItem("token")
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

  const renderItem = (item, index) => (
    <div key={item.Id}>
      <ProductListItem
        iconCube={true}
        onLongPress={() => {
          if (window.confirm('Məhsulu silməyə əminsiniz?')) {
            handleDelete(item.Id);
          }
        }}
        onPress={() => {
          if (state?.setState) {
            navigate('/product-position', {
              state: {
                product: item,
                state: state.state,
                setState: state.setState,
                type: state.type,
                units: state.units,
                setUnits: state.setUnits,
                setHasUnsavedChanges: state.setHasUnsavedChanges
              }
            })
          } else {
            if (permission_ver(permissions, 'sub_product', "U")) {
              navigate('/product/product-manage', { state: { id: item.Id } })
            } else {
              ErrorMessage("İcazə yoxdur!");
            }
          }
        }}
        product={item}
      />
      <Line width={'90%'} />
    </div>
  );

  const handleScanner = () => {
    navigate('/product/product-scanner', {
      state: {
        setData: (e) => {
          setFilter(rel => ({ ...rel, fast: e }));
        }
      }
    });
  };

  const reload = () => {
    if (filter.fast === "") {
      fetchingProductsData();
    } else {
      fetchingProductsSearchData();
    }
  }

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

  useEffect(() => {
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
  }, [filter]);

  return (
    <div style={styles.container}>

      <ListPagesHeader
        processScannerClick={handleScanner}
        header={"Məhsullar"}
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'fast'}
        isFilter={true}
        processFilterClick={() => {
          navigate('/filter', {
            state: {
              filter: filter,
              // setFilter: setFilter, // Pass callback not simple here, but logic needs review in Filter page
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
            }
          });
        }}
      />

      <div style={styles.selectContainer}>
        <select
          style={styles.select}
          value={selected}
          onChange={(e) => {
            const val = e.target.value;
            setSelected(val);
            let myFilter = { ...filter, };
            delete myFilter.endpoint;
            delete myFilter.ismanufacture;
            delete myFilter.isservice;
            delete myFilter.isparty;
            delete myFilter.ismediary;
            delete myFilter.ismanufacture;

            myFilter = { ...myFilter, ...selectionData[Number(val)].value }

            setFilter(myFilter);
          }}
        >
          {selectionData.map((element) => (
            <option key={element.selected} value={element.selected}>
              {element.name}
            </option>
          ))}
        </select>
      </div>

      {
        products == null ?
          <div style={styles.loadingContainer}>
            <div className="spinner"></div>
          </div>
          :
          <div style={styles.listContainer}>
            {products.map((item, index) => renderItem(item, index))}
            <FooterComponent />
          </div>
      }

      <FabButton onPress={() => {
        if (permission_ver(permissions, 'sub_product', 'C')) {
          navigate('/product/product-manage', { state: { id: null } });
        } else {
          ErrorMessage('İcazə yoxdur!');
        }
      }} />
    </div>
  );
};

export default ProductList;
