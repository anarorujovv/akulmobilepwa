import React, { useCallback, useEffect, useState } from 'react';
import { SpinLoading, Divider, Picker, Button, FloatingBubble, Space } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import ProductListItem from '../../shared/ui/list/ProductListItem';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';
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
  const [selected, setSelected] = useState('0');
  const [pickerVisible, setPickerVisible] = useState(false);

  const selectionData = [
    { value: {}, selected: '0', name: 'Məhsullar' },
    { value: { endpoint: 'kits' }, selected: '1', name: 'Dəstlər' },
    { value: { isservice: true }, selected: '2', name: 'Xidmətlər' },
    { value: { isparty: true }, selected: '3', name: 'Partiyalar' },
    { value: { ismediary: true }, selected: '4', name: 'Komisyonlar' },
    { value: { ismanufacture: true }, selected: '5', name: 'İsthesal' }
  ];

  const selectorOptions = selectionData.map(item => ({
    label: item.name,
    value: item.selected
  }));

  let [filter, setFilter] = useState({
    dr: 0,
    sr: 'Name',
    pg: 1,
    gp: '',
    lm: 50,
    ar: 0,
    fast: ''
  });

  const fetchingProductsData = async () => {
    setIsRefreshing(true);
    let data = {
      ...filter,
      pg: filter.pg - 1,
      token: await AsyncStorageWrapper.getItem('token')
    };

    await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/get.php`, data)
      .then(element => {
        if (element != null) {
          setItemSize(element.Count);
          setProducts([...element.List]);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const fetchingProductsSearchData = async () => {
    let data = {
      ...filter,
      pg: filter.pg - 1,
      token: await AsyncStorageWrapper.getItem('token')
    };
    await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/getfast.php`, data)
      .then(element => {
        if (element != null) {
          setProducts([...element.List]);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  const handleDelete = async (itemId) => {
    if (permission_ver(permissions, 'sub_product', 'D')) {
      let data = { ...filter };
      await api(`${data.endpoint != undefined ? data.endpoint : 'products'}/del.php?id=${itemId}`, {
        token: await AsyncStorageWrapper.getItem('token')
      })
        .then(element => {
          if (element != null) {
            SuccessMessage('Silindi');
            setProducts([]);
            reload();
          }
        })
        .catch(err => {
          ErrorMessage(err);
        });
    } else {
      ErrorMessage('İcazə yoxdur!');
    }
  };

  const renderItem = (item, index) => (
    <React.Fragment key={item.Id}>
      <ProductListItem
        iconCube={true}
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
            });
          } else {
            if (permission_ver(permissions, 'sub_product', 'U')) {
              navigate('/product/product-manage', { state: { id: item.Id } });
            } else {
              ErrorMessage('İcazə yoxdur!');
            }
          }
        }}
        onLongPress={() => {
          if (window.confirm('Məhsulu silməyə əminsiniz?')) {
            handleDelete(item.Id);
          }
        }}
        product={item}
        index={index + 1}
      />
      <Divider style={{ margin: 0 }} />
    </React.Fragment>
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
    if (filter.fast === '') {
      fetchingProductsData();
    } else {
      fetchingProductsSearchData();
    }
  };

  const FooterComponent = () => {
    return products.length === 50 || page !== 1 ? (
      <MyPagination
        pageSize={50}
        itemSize={itemSize}
        page={filter.pg}
        setPage={(e) => {
          setFilter(rel => ({ ...rel, pg: e }));
        }}
      />
    ) : null;
  };

  useEffect(() => {
    let time;
    console.log('ProductList filter changed:', filter);
    setProducts(null);

    if (filter.fast === '') {
      fetchingProductsData();
    } else {
      time = setTimeout(() => {
        fetchingProductsSearchData();
      }, 400);
    }

    return () => clearTimeout(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSelectorChange = (val) => {
    if (!val || val.length === 0) return;
    const selectedValue = val[0];
    setSelected(selectedValue);
    let myFilter = { ...filter };
    delete myFilter.endpoint;
    delete myFilter.ismanufacture;
    delete myFilter.isservice;
    delete myFilter.isparty;
    delete myFilter.ismediary;

    const selectedItem = selectionData.find(item => item.selected === selectedValue);
    if (selectedItem) {
      myFilter = { ...myFilter, ...selectedItem.value };
    }
    setFilter(myFilter);
  };

  const handleFabClick = () => {
    if (permission_ver(permissions, 'sub_product', 'C')) {
      navigate('/product/product-manage', { state: { id: null } });
    } else {
      ErrorMessage('İcazə yoxdur!');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--adm-color-background)',
      overflow: 'hidden'
    }}>
      <ListPagesHeader
        processScannerClick={handleScanner}
        header={'Məhsullar'}
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'fast'}
        isFilter={true}
        filterParams={{
          searchParams: [
            'productName',
            'barCode',
            'groups',
            'artCode',
            'owners',
            'customers'
          ],
          customFields: {
            groups: {
              title: 'Qrup',
              name: 'gp',
              api: 'productfolders',
              type: 'select'
            }
          },
          sortList: [
            { id: 1, label: 'Ad', value: 'Name' },
            { id: 2, label: 'Barkod', value: 'BarCode' },
            { id: 3, label: 'Qrup', value: 'GroupName' },
            { id: 4, label: 'Alış qiyməti', value: 'BuyPrice' },
            { id: 5, label: 'Satış qiyməti', value: 'Price' },
            { id: 6, label: 'Təchizatçı', value: 'CustomerName' },
            { id: 7, label: 'Anbar qalığı', value: 'StockBalance' }
          ]
        }}
      />

      <div style={{ padding: '8px 12px' }}>
        <Button
          block
          onClick={() => setPickerVisible(true)}
          style={{
            '--border-radius': '8px',
            '--text-color': 'var(--adm-color-text)',
            justifyContent: 'flex-start'
          }}
        >
          <Space align='center' style={{ '--gap': '8px' }}>
            <span>{selectionData.find(item => item.selected === selected)?.name || 'Seçin'}</span>
          </Space>
        </Button>
        <Picker
          columns={[selectorOptions]}
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          value={[selected]}
          onConfirm={handleSelectorChange}
          confirmText='Təsdiq'
          cancelText='Ləğv et'
        />
      </div>

      {products === null ? (
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <SpinLoading color='primary' style={{ '--size': '40px' }} />
        </div>
      ) : (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 80,
          padding: '0 12px 80px 12px'
        }}>
          {products.map((item, index) => renderItem(item, index))}
          <FooterComponent />
        </div>
      )}

      <FloatingBubble
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
          '--background': 'var(--adm-color-primary)',
          '--size': '56px'
        }}
        onClick={handleFabClick}
      >
        <AddOutline fontSize={28} color='#fff' />
      </FloatingBubble>
    </div>
  );
};

export default ProductList;
