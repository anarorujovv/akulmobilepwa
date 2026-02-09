import React, { useEffect, useState } from 'react';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import useTheme from '../../shared/theme/useTheme';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from './../../services/formatPrice';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import getDateByIndex from './../../services/report/getDateByIndex';

const Profit = () => {
  let theme = useTheme();
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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.bg,
      overflow: 'hidden'
    },
    content: {
      flex: 1,
      overflowY: 'auto'
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.primary,
      padding: 12,
      justifyContent: 'space-between',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    headerText: {
      color: theme.bg,
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
      textAlign: 'center',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      padding: '10px 0',
      borderBottom: `1px solid ${theme.whiteGrey}`,
      backgroundColor: theme.whiteGrey,
      alignItems: 'center',
      cursor: 'pointer'
    },
    cell: {
      flex: 1,
      textAlign: 'left',
      fontSize: 14,
      color: theme.black,
      paddingLeft: 10,
    },
    subRow: {
      display: 'flex',
      flexDirection: 'row',
      padding: '8px 0 8px 20px',
      borderBottom: `1px solid ${theme.whiteGrey}`,
      backgroundColor: theme.whiteGrey,
    },
    subCell: {
      flex: 1,
      textAlign: 'left',
      fontSize: 13,
      color: theme.grey,
    },
    tableContainer: {
      margin: 10,
      borderRadius: 12,
      border: `2px solid ${theme.primary}`,
      overflow: 'hidden'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    }
  };

  const handleExpandItem = () => {
    setExpandedItem(rel => rel == 3 ? 0 : 3);
  };

  let isBold = [1, 3, 5];

  const renderItem = (item, index) => {
    let answer = isBold.findIndex(rel => rel == item.id);
    const isBoldStyle = answer != -1 ? { fontWeight: 'bold' } : {};
    const isNegativeStyle = formatPrice(item.value).includes('-') ? { color: theme.red } : {}; // formatPrice might return string with currency, assume negative check based on value being passed

    // Quick check if value is logically negative, but formatPrice usually returns string. 
    // If formatPrice handles negative formatting, we just check style.
    // Replicating original logic: formatPrice(item.value) < 0 ? ... which is numeric comparison on string? no.
    // Assuming item.value is number here.

    if (item.isExpandable) {
      return (
        <div key={index}>
          <div onClick={handleExpandItem} style={styles.row}>
            <span style={styles.cell}>
              {item.key} <span style={{ marginLeft: 5 }}>{expandedItem === index ? <FaAngleUp /> : <FaAngleDown />}</span>
            </span>
            <span style={{ ...styles.cell, ...styles.valueCell }}>{item.value}</span>
          </div>

          {expandedItem === index && item.subItems.map((subItem, subIndex) => (
            <div key={subIndex} style={styles.subRow}>
              <span style={styles.subCell}>{subItem.Name}</span>
              <span style={{ ...styles.subCell, ...styles.valueCell }}>{formatPrice(subItem.Amount)}</span>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div key={index} style={styles.row}>
          <span style={{ ...styles.cell, ...isBoldStyle }}>{item.key}</span>
          <span style={{
            ...styles.cell,
            ...styles.valueCell,
            ...isBoldStyle,
            ...(item.id === 5 && parseFloat(item.raw_value || 0) < 0 ? { color: theme.red } : {})
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
  }, [filter]);

  return (
    <div style={styles.container}>
      <ListPagesHeader
        header={'Mənfəət və Zərər'}
      />
      <div style={styles.content}>
        <DocumentTimes
          filter={filter}
          setFilter={setFilter}
          selected={selectedTime}
          setSelected={setSelectedTime}
        />

        <div style={styles.tableContainer}>
          <div style={styles.header}>
            <span style={styles.headerText}>Maddə</span>
            <span style={styles.headerText}>Mənfəət/Zərər</span>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div className="spinner"></div>
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
