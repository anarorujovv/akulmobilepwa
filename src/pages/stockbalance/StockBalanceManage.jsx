import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import useTheme from '../../shared/theme/useTheme';
import translateProductStockTerm from './../../services/report/translateProductStockTerm';
import { formatPrice } from '../../services/formatPrice';
import MyPagination from '../../shared/ui/MyPagination';
import Line from './../../shared/ui/Line';
import ListItem from '../../shared/ui/list/ListItem';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import { useLocation } from 'react-router-dom';
import { FaCube } from 'react-icons/fa';

const StockBalanceManage = () => {
  const location = useLocation();
  const { id, name } = location.state || {}; // Get from state

  let theme = useTheme();

  const [selectedTime, setSelectedTime] = useState(4);
  const local = useGlobalStore(state => state.local);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.bg,
      overflow: 'hidden'
    },
    title: {
      margin: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: theme.black
    },
    datePickerContainer: {
      width: '100%'
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    listContainer: {
      flex: 1,
      overflowY: 'auto'
    }
  };

  let [filter, setFilter] = useState({
    lm: 50,
    productid: id,
    dr: 1,
    pg: 0,
    sr: "Moment",
  });

  const [productStatus, setProductStatus] = useState(null); // Fixed typo 'productStaus'
  const [itemSize, setItemSize] = useState(0);

  let fetchingStockList = async () => {
    let obj = { ...filter };
    obj.token = await AsyncStorageWrapper.getItem("token");
    await api('producthistory/get.php', obj).then(item => {
      if (item != null) {
        setItemSize(item.Count);
        let data = [...item.List];
        if (!local.demands.stockBalance.supplyBalance) {
          data = data.filter(item => item.Document != 'supplies' && item.Document != 'supplyreturns'); // corrected logical operator assumption from original code
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
      // Update filter if ID changes or on mount
      setFilter(prev => ({ ...prev, productid: id }));
    }
  }, [id]);

  useEffect(() => {
    if (filter.productid) {
      fetchingStockList();
    }
  }, [filter]);

  return (
    <div style={styles.container}>
      <span style={styles.title}>{name}</span>
      <Line width={'90%'} />
      <div style={styles.datePickerContainer}>
        <DateRangePicker
          submit={true}
          width={'100%'}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      <DocumentTimes
        filter={filter}
        setFilter={setFilter}
        selected={selectedTime}
        setSelected={setSelectedTime}
      />

      {productStatus == null ? (
        <div style={styles.loadingContainer}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {productStatus.List.map((element, index) => {
            return (
              <div key={index}>
                <ListItem
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
              </div>
            );
          })}

          <MyPagination
            itemSize={itemSize}
            page={filter.pg + 1}
            pageSize={50}
            setPage={(e) => {
              setFilter(rel => ({ ...rel, ['pg']: e - 1 }));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StockBalanceManage;
