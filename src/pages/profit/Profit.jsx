import React, { useEffect, useState } from 'react';
import { SpinLoading } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from './../../services/formatPrice';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import getDateByIndex from './../../services/report/getDateByIndex';

const Profit = () => {
  const [expandedItem, setExpandedItem] = useState(0);
  let [profit, setProfit] = useState(null);
  let [selectedTime, setSelectedTime] = useState(2);

  let [filter, setFilter] = useState({
    dr: 1,
    sr: "",
    pg: 1,
    lm: 100,
    ...getDateByIndex(2)
  });
  let [loading, setLoading] = useState(true);

  const handleExpandItem = () => {
    setExpandedItem(rel => rel == 3 ? 0 : 3);
  };

  let isBold = [1, 3, 5];

  const renderItem = (item, index) => {
    let answer = isBold.findIndex(rel => rel == item.id);
    const isBoldStyle = answer != -1 ? { fontWeight: 'bold' } : {};
    // const isNegativeStyle = formatPrice(item.value).includes('-') ? { color: 'var(--adm-color-danger)' } : {};

    if (item.isExpandable) {
      return (
        <div key={index}>
          <div onClick={handleExpandItem} style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '12px 0 12px 12px',
            borderBottom: '1px solid var(--adm-color-border)',
            backgroundColor: 'var(--adm-color-background)',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <span style={{
              flex: 1,
              textAlign: 'left',
              fontSize: 14,
              color: 'var(--adm-color-text)',
              display: 'flex',
              alignItems: 'center'
            }}>
              {item.key} <span style={{ marginLeft: 8, display: 'flex' }}>{expandedItem === index ? <UpOutline /> : <DownOutline />}</span>
            </span>
            <span style={{
              flex: 1,
              textAlign: 'left',
              fontSize: 14,
              color: 'var(--adm-color-text)',
              fontWeight: 'bold',
              paddingLeft: 10
            }}>{item.value}</span>
          </div>

          {expandedItem === index && item.subItems.map((subItem, subIndex) => (
            <div key={subIndex} style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '10px 0 10px 32px',
              borderBottom: '1px solid var(--adm-color-border)',
              backgroundColor: 'var(--adm-color-background)',
            }}>
              <span style={{
                flex: 1,
                textAlign: 'left',
                fontSize: 13,
                color: 'var(--adm-color-weak)',
              }}>{subItem.Name}</span>
              <span style={{
                flex: 1,
                textAlign: 'left',
                fontSize: 13,
                color: 'var(--adm-color-text)',
                fontWeight: 'bold',
                paddingLeft: 10
              }}>{formatPrice(subItem.Amount)}</span>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div key={index} style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '12px 0 12px 12px',
          borderBottom: '1px solid var(--adm-color-border)',
          backgroundColor: 'var(--adm-color-background)',
          alignItems: 'center',
        }}>
          <span style={{
            flex: 1,
            textAlign: 'left',
            fontSize: 14,
            color: 'var(--adm-color-text)',
            ...isBoldStyle
          }}>{item.key}</span>
          <span style={{
            flex: 1,
            textAlign: 'left',
            fontSize: 14,
            color: 'var(--adm-color-text)',
            fontWeight: 'bold',
            paddingLeft: 10,
            ...isBoldStyle,
            ...(item.id === 5 && parseFloat(item.raw_value || 0) < 0 ? { color: 'var(--adm-color-danger)' } : {})
          }}>
            {item.value}
          </span>
        </div>
      );
    }
  };

  const fetchingProfit = async () => {
    let obj = {
      ...filter,
      token: await AsyncStorageWrapper.getItem('token'),
      pg: filter.pg - 1
    };

    await api('profit/get.php', obj)
      .then((item) => {
        if (item != null) {
          let itemData = { ...item };
          let data = [
            { key: 'Satış dövriyyəsi', value: formatPrice(itemData.SaleSum), id: 1 },
            { key: 'Mayası', value: formatPrice(itemData.CostSum), id: 2 },
            { key: 'Dövriyyə mənfəəti', value: formatPrice(itemData.TurnoverProfit), id: 3 },
            {
              key: 'Xərclər (toplam)',
              value: formatPrice(itemData.SpendItemsSum),
              isExpandable: true,
              id: 4,
              subItems: itemData.SpendItems ? [...itemData.SpendItems] : []
            },
            { key: 'Təmiz mənfəət', value: formatPrice(itemData.NetProfit), id: 5, raw_value: itemData.NetProfit }
          ];
          setProfit(data);
          setLoading(false);
        }
      }).catch(err => {
        ErrorMessage(err);
      });
  };

  useEffect(() => {
    fetchingProfit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--adm-color-background)',
      overflow: 'hidden'
    }}>
      <ListPagesHeader
        header={'Mənfəət və Zərər'}
      />
      <div style={{
        flex: 1,
        overflowY: 'auto'
      }}>
        <DocumentTimes
          filter={filter}
          setFilter={setFilter}
          selected={selectedTime}
          setSelected={setSelectedTime}
        />

        <div style={{
          margin: 16,
          borderRadius: 12,
          border: '1px solid var(--adm-color-primary)',
          overflow: 'hidden',
          backgroundColor: 'var(--adm-color-background)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'var(--adm-color-primary)',
            padding: 12,
            justifyContent: 'space-between',
          }}>
            <span style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
              flex: 1,
              textAlign: 'center',
            }}>Maddə</span>
            <span style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
              flex: 1,
              textAlign: 'center',
            }}>Mənfəət/Zərər</span>
          </div>

          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20
            }}>
              <SpinLoading color='primary' />
            </div>
          ) : (
            <div>
              {profit && profit.map((item, index) => renderItem(item, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profit;
