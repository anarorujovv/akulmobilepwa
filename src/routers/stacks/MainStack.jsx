import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './../../pages/Home';
import ProductStack from '../../pages/product/ProductStack';
import SupplyStack from './../../pages/supply/SupplyStack';
import DemandStack from '../../pages/demand/DemandStack';
import DemandReturnStack from '../../pages/demandreturn/DemandReturnStack';
import SupplyReturnStack from '../../pages/supplyreturn/SupplyReturnStack';
import PaymentStack from '../../pages/payment/PaymentStack';
import DebtStack from '../../pages/debt/DebtStack';
import CustomerStack from './../../pages/customer/CustomerStack';
import StockBalanceStack from '../../pages/stockbalance/StockBalanceStack';
import CasheStack from './../../pages/cashe/CasheStack';
import Profile from '../../pages/profile/Profile';
import SettingStack from '../../pages/profile/settings/SettingStack';
import SaleReportStack from './../../pages/salereport/SaleReportStack';
import Profit from '../../pages/profit/Profit';
import DailyProfits from '../../pages/dailyreports/DailyReports';
import Comprehensive from '../../pages/comprehensive/Comprehensive';
import ProductTransactionsStack from '../../pages/producttransactions/ProductTransactionsStack';
import InventoryStack from '../../pages/inventory/InventoryStack';
import PrintAndShare from '../../shared/ui/PrintAndShare';
import CashTransactionStack from '../../pages/cashtransactions/CashTransactionStack';
import ShiftStack from '../../pages/shift/ShiftStack';
import SaleStack from '../../pages/sale/SaleStack';
import Dashboard from '../../pages/dashboard/Dashboard';
import ReturnStack from '../../pages/return/ReturnStack';
import CreditTransactionStack from '../../pages/creditTransaction/CreditTransactionStack';
import CashInList from '../../pages/cashin/CashInList';
import CashOutList from '../../pages/cashout/CashOutList';
import CustomerOrderStack from '../../pages/customerorders/CustomerOrderStack';
import Filter from '../../shared/ui/Filter';
import MoveStack from '../../pages/move/MoveStack';
import EnterStack from '../../pages/enter/EnterStack';
import LossStack from '../../pages/loss/LossStack';
import ExpeditorStack from '../../pages/expeditor/ExpeditorStack';
import CatalogStack from '../../pages/catalog/CatalogStack';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animation: 'fade'
    }}>

      <Stack.Screen name='home' component={Home} />

      {/* Göstəricilər */}

      <Stack.Screen name='dashboard' component={Dashboard} />
      <Stack.Screen name='catalog' component={CatalogStack} />

      {/* Məhsullar */}

      <Stack.Screen name='sub_product' component={ProductStack} />
      <Stack.Screen name='inventory' component={InventoryStack} />
      <Stack.Screen name='stockbalance' component={StockBalanceStack} />
      <Stack.Screen name='loss' component={LossStack} />
      <Stack.Screen name='enter' component={EnterStack} />
      <Stack.Screen name='move' component={MoveStack} />

      {/* Alışlar */}

      <Stack.Screen name='supply' component={SupplyStack} />
      <Stack.Screen name='supplyreturns' component={SupplyReturnStack} />

      {/* Satışlar */}


      <Stack.Screen name='demand' component={DemandStack} />
      <Stack.Screen name='demandreturns' component={DemandReturnStack} />

      {/* Tərəf-müqabilləri */}

      <Stack.Screen name='customer' component={CustomerStack} />

      {/* Maliyyə */}
      <Stack.Screen name='page_payments' component={PaymentStack} />
      <Stack.Screen name='settlements' component={DebtStack} />
      <Stack.Screen name='cashtransactions' component={CashTransactionStack} />

      {/* Distributorlar */}
      <Stack.Screen name='expeditor' component={ExpeditorStack} />

      {/*  */}
      <Stack.Screen name='shifts' component={ShiftStack} />
      <Stack.Screen name='sale' component={SaleStack} />
      <Stack.Screen name='returns' component={ReturnStack} />
      <Stack.Screen name='credittransaction' component={CreditTransactionStack} />
      <Stack.Screen name='cashins' component={CashInList} />
      <Stack.Screen name='cashouts' component={CashOutList} />


      {/* Hesabatlar */}
      <Stack.Screen name='salereports' component={SaleReportStack} />
      <Stack.Screen name='profit' component={Profit} />
      <Stack.Screen name='dailyreports' component={DailyProfits} />
      <Stack.Screen name='comprehensive' component={Comprehensive} />
      <Stack.Screen name='producttransactions' component={ProductTransactionsStack} />
      <Stack.Screen name='cashes' component={CasheStack} />
      <Stack.Screen name='customerorders' component={CustomerOrderStack} />

      {/*  Profile */}
      <Stack.Screen name='profile' component={Profile} />
      <Stack.Screen name='settings' component={SettingStack} />

      <Stack.Screen name='print-and-share' component={PrintAndShare} />
      <Stack.Screen name='filter' component={Filter} />

    </Stack.Navigator>
  )
}

export default MainStack

const styles = StyleSheet.create({})