import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import useTheme from '../../shared/theme/useTheme';
import translateProductStockTerm from './../../services/report/translateProductStockTerm';
import { formatPrice } from '../../services/formatPrice';
import MyPagination from '../../shared/ui/MyPagination';
import ListItem from '../../shared/ui/list/ListItem';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCube } from 'react-icons/fa';
import { SpinLoading, NavBar, Space, Divider, List, Card } from 'antd-mobile';

const StockBalanceManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');

  let theme = useTheme();

  const [selectedTime, setSelectedTime] = useState(4);
  const local = useGlobalStore(state => state.local);

  let [filter, setFilter] = useState({
    lm: 50,
    productid: id,
    dr: 1,
    pg: 0,
    sr: "Moment",
  });

  const [productStatus, setProductStatus] = useState(null);
  const [itemSize, setItemSize] = useState(0);

  // Fetch product name if not available (optional improvement)
  const fetchProductInfo = async () => {
    try {
      const token = await AsyncStorageWrapper.getItem("token");
      // If there's an API to get single product by ID
      const res = await api('products/get.php', { id, token });
      if (res && res.List && res.List[0]) {
        setProductName(res.List[0].Name);
      }
    } catch (e) {
      console.error(e);
    }
  }

  let fetchingStockList = async () => {
    let obj = { ...filter };
    obj.token = await AsyncStorageWrapper.getItem("token");
    await api('producthistory/get.php', obj).then(item => {
      if (item != null) {
        setItemSize(item.Count);
        let data = [...item.List];
        if (!local.demands.stockBalance.supplyBalance) {
          data = data.filter(item => item.Document != 'supplies' && item.Document != 'supplyreturns');
        }
        item.List = [...data];
        setProductStatus(item);
      }
    }).catch(err => {
      ErrorMessage(err);
    });
  };

  useEffect(() => {
    if (id) {
      setFilter(prev => ({ ...prev, productid: id }));
      fetchProductInfo();
    }
  }, [id]);

  useEffect(() => {
    if (filter.productid) {
      fetchingStockList();
    }
  }, [filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: theme.bg, overflow: 'hidden' }}>
      <NavBar onBack={() => navigate(-1)} style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        {productName || 'Məhsul Tarixçəsi'}
      </NavBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 80px 10px' }}>
        <Space direction='vertical' block style={{ '--gap': '10px' }}>
          <Card style={{ padding: '0 10px' }}>
            <DateRangePicker
              submit={true}
              width={'100%'}
              filter={filter}
              setFilter={setFilter}
            />
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ paddingBottom: 10 }}>
              <DocumentTimes
                filter={filter}
                setFilter={setFilter}
                selected={selectedTime}
                setSelected={setSelectedTime}
              />
            </div>
          </Card>

          {productStatus == null ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <SpinLoading color='primary' />
            </div>
          ) : (
            <>
              <List header='Tarixçə'>
                {productStatus.List.map((element, index) => (
                  <ListItem
                    key={index}
                    index={index + 1}
                    iconBasket={true}
                    firstText={translateProductStockTerm(element.Document)}
                    centerText={formatPrice(element.Price)}
                    endText={formatPrice(element.Quantity)}
                    priceText={
                      <span>
                        {formatPrice(element.StockQuantity)} <FaCube size={10} color={parseFloat(element.StockQuantity) >= 0 ? theme.green : theme.red} />
                      </span>
                    }
                    notPriceIcon={true}
                  />
                ))}
              </List>

              <MyPagination
                itemSize={itemSize}
                page={filter.pg + 1}
                pageSize={50}
                setPage={(e) => {
                  setFilter(rel => ({ ...rel, ['pg']: e - 1 }));
                }}
              />
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default StockBalanceManage;
