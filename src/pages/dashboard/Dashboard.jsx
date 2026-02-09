import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { AiOutlineReload, AiOutlineShoppingCart, AiOutlineLineChart, AiOutlineBank, AiOutlineAppstore } from 'react-icons/ai'; // Replaced icons
import { FaMoneyBillWave, FaClipboardList } from 'react-icons/fa'; // More icons
import getDateByIndex from '../../services/report/getDateByIndex';
import { formatPrice } from '../../services/formatPrice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const [dashboardState, setDashboardState] = useState(null);

  const styles = {
    container: {
      flex: 1,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.bg,
      overflow: 'hidden',
      position: 'relative'
    },
    scrollView: {
      overflowY: 'auto',
      flex: 1,
      padding: 15
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.black
    },
    gridContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 15
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      width: '100%',
      color: theme.primary
    },
    cardContainer: {
      width: 'calc(50% - 10px)', // roughly 45% in RN, adjusted for flex gap
      borderRadius: 10,
      padding: 15,
      border: '1px solid #ddd',
      backgroundColor: theme.whiteGrey,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      boxSizing: 'border-box'
    },
    cardHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
      color: theme.primary
    },
    cardContent: {
      marginTop: 10,
    },
    cardItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    cardItemKey: {
      fontSize: 14,
      color: theme.grey
    },
    cardItemValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.black
    },
    chartContainer: {
      width: '100%',
      marginBottom: 20,
      height: 300,
      backgroundColor: theme.whiteGrey,
      borderRadius: 10,
      padding: 10,
      border: '1px solid #ddd'
    },
    reloadButton: {
      position: 'absolute',
      top: 15,
      right: 15,
      zIndex: 9999,
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorageWrapper.getItem('token');
      const response = await api('dashboard/get.php', { token });
      let dashboardState = response;

      const body = {
        dr: 0,
        sr: "Profit",
        pg: 1,
        gp: null,
        zeros: null,
        ar: null,
        lm: 100,
        own: null,
        showc: null,
        showh: null,
        pricetype: null,
        quick: null,
        docNumber: "",
        token: token
      }

      let arr = [
        {
          key: 'CurrAmount'
        },
        {
          key: 'PrevAmount'
        }
      ]

      await Promise.all(arr.map(async (item, index) => {
        const saleReport = await api('salereports/get.php', { ...body, ...getDateByIndex(index) });
        dashboardState.Sales[item.key] = formatPrice(saleReport.AllAmount);
        dashboardState.Profits[item.key] = formatPrice(saleReport.AllProfit);
      }))

      if (dashboardState) setDashboardState(dashboardState);

    } catch (error) {
      ErrorMessage(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCard = (title, icon, items, style = {}) => (
    <div style={{ ...styles.cardContainer, ...style }}>
      <div style={styles.cardHeader}>
        {icon}
        <span style={styles.cardTitle}>{title}</span>
      </div>
      <div style={styles.cardContent}>
        {items.map((item, index) => (
          <div key={index} style={styles.cardItem}>
            <span style={styles.cardItemKey}>{item.key}</span>
            <span style={styles.cardItemValue}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSalesChart = () => {
    if (!dashboardState?.Charts?.Sales) return null;

    const salesData = dashboardState.Charts.Sales.slice(-5); // Son 5 günü al
    // Recharts expects array of objects
    const data = salesData.map((entry) => ({
      name: entry.Moment.slice(5),
      amount: parseFloat(entry.Amount)
    }));

    return (
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke={theme.primary} activeDot={{ r: 8 }} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => {
          if (dashboardState != null) {
            setDashboardState(null);
          }
          fetchData();
        }}
        style={styles.reloadButton}>
        <AiOutlineReload size={30} color={theme.primary} />
      </button>

      <div style={styles.scrollView}>
        {!dashboardState ? (
          <div style={styles.loadingContainer}>
            <div className="spinner"></div> // Assuming spinner class exists
            <span style={styles.loadingText}>Yüklənir...</span>
          </div>
        ) : (
          <div style={styles.gridContainer}>
            <span style={styles.headerText}>İdarəetmə Paneli</span>

            {renderCard(
              'Satışlar',
              <AiOutlineShoppingCart size={24} color={theme.orange} />,
              [
                { key: 'Bu gün', value: dashboardState.Sales.CurrAmount },
                { key: 'Dünən', value: dashboardState.Sales.PrevAmount },
              ]
            )
            }

            {renderCard(
              'Mənfəət',
              <AiOutlineLineChart size={24} color={theme.primary} />,
              [
                { key: 'Bu gün', value: dashboardState.Profits.CurrAmount },
                { key: 'Dünən', value: dashboardState.Profits.PrevAmount },
              ]
            )}

            {renderCard(
              'Ödənişlər',
              <FaMoneyBillWave size={24} color={theme.pink} />,
              [
                { key: 'Mədaxil', value: dashboardState.Payments.Payins },
                { key: 'Məxaric', value: dashboardState.Payments.Payouts },
              ]
            )}

            {renderCard(
              'Borclar',
              <AiOutlineBank size={24} color={theme.red} />,
              [
                { key: 'Borc (alacaq)', value: dashboardState.Settlements.Credit },
                { key: 'Borc (verəcək)', value: dashboardState.Settlements.Debt },
              ]
            )}

            {renderCard(
              'Sifarişlər',
              <FaClipboardList size={24} color={theme.orange} />,
              [
                { key: 'Rezerv', value: dashboardState.Orders.Prepared },
                { key: 'Hazırlanıb', value: dashboardState.Orders.Reserved },
              ],
              { width: '100%' }
            )}

            {renderSalesChart()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
