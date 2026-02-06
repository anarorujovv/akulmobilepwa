import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import getDateByIndex from '../../services/report/getDateByIndex';
import { formatPrice } from '../../services/formatPrice';

const Dashboard = () => {
  const theme = useTheme();
  const [dashboardState, setDashboardState] = useState(null);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
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
    <View style={[styles.cardContainer, style, { backgroundColor: theme.whiteGrey }]}>
      <View style={styles.cardHeader}>
        {icon}
        <Text style={[styles.cardTitle, { color: theme.primary }]}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {items.map((item, index) => (
          <View key={index} style={styles.cardItem}>
            <Text style={[styles.cardItemKey, { color: theme.grey }]}>{item.key}</Text>
            <Text style={[styles.cardItemValue, { color: theme.black }]}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSalesChart = () => {
    if (!dashboardState?.Charts?.Sales) return null;

    const salesData = dashboardState.Charts.Sales.slice(-5); // Son 5 günü al
    const labels = salesData.map((entry) => entry.Moment.slice(5));
    const data = salesData.map((entry) => parseFloat(entry.Amount));



    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels,
            datasets: [{ data, strokeWidth: 2 }],
          }}
          width={Dimensions.get('window').width - 30} // Grafik genişliği
          height={220} // Grafik yüksekliği
          chartConfig={{
            backgroundColor: theme.whiteGrey,
            backgroundGradientFrom: theme.whiteGrey,
            backgroundGradientTo: theme.whiteGrey,
            decimalPlaces: 0,
            color: (opacity) => theme.primary,
            labelColor: (opacity) => theme.black,
            style: { borderRadius: 10 },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: theme.primary,
            },
          }}
          bezier
          style={{ marginVertical: 10, borderRadius: 10 }}
        />
      </View>
    );
  };

  return (
    <View style={{
      flex: 1,
    }}>
      <TouchableOpacity
        onPress={() => {
          if (dashboardState != null) {
            setDashboardState(null);
          }
          fetchData();
        }}
        style={{
          position: 'absolute',
          top: 15,
          right: 15,
          width: 30,
          height: 30,
          zIndex: 9999
        }}>
        <AntDesign name='reload1' size={30} color={theme.primary} />
      </TouchableOpacity>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
        {!dashboardState ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={50} color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.black }]}>Yüklənir...</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            <Text style={[styles.headerText, { color: theme.primary }]}>İdarəetmə Paneli</Text>

            {renderCard(
              'Satışlar',
              <Icon name="cart-outline" size={24} color={theme.orange} />,
              [
                { key: 'Bu gün', value: dashboardState.Sales.CurrAmount },
                { key: 'Dünən', value: dashboardState.Sales.PrevAmount },
              ]
            )
            }

            {renderCard(
              'Mənfəət',
              <Icon name="trending-up" size={24} color={theme.primary} />,
              [
                { key: 'Bu gün', value: dashboardState.Profits.CurrAmount },
                { key: 'Dünən', value: dashboardState.Profits.PrevAmount },
              ]
            )}

            {renderCard(
              'Ödənişlər',
              <Icon name="cash-multiple" size={24} color={theme.pink} />,
              [
                { key: 'Mədaxil', value: dashboardState.Payments.Payins },
                { key: 'Məxaric', value: dashboardState.Payments.Payouts },
              ]
            )}

            {renderCard(
              'Borclar',
              <Icon name="bank" size={24} color={theme.red} />,
              [
                { key: 'Borc (alacaq)', value: dashboardState.Settlements.Credit },
                { key: 'Borc (verəcək)', value: dashboardState.Settlements.Debt },
              ]
            )}

            {renderCard(
              'Sifarişlər',
              <Icon name="clipboard-list" size={24} color={theme.orange} />,
              [
                { key: 'Rezerv', value: dashboardState.Orders.Prepared },
                { key: 'Hazırlanıb', value: dashboardState.Orders.Reserved },
              ],
              { width: '100%' }
            )}

            {renderSalesChart()}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    width: '100%',
  },
  cardContainer: {
    width: '45%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardContent: {
    marginTop: 10,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardItemKey: {
    fontSize: 14,
  },
  cardItemValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartScrollContainer: {
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Dashboard;
