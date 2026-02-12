import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SpinLoading } from 'antd-mobile';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import api from '../../services/api';
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

const MainStack = () => {
  const setPermissions = useGlobalStore(state => state.setPermissions);
  const setMarks = useGlobalStore(state => state.setMarks);
  const setLocal = useGlobalStore(state => state.setLocal);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializeApp = async () => {
    try {
      const token = await AsyncStorageWrapper.getItem('token');

      const localAsync = await AsyncStorageWrapper.getItem('local_per');
      if (localAsync) {
        setLocal(JSON.parse(localAsync));
      } else {
        // Fallback default config if local_per is missing
        setLocal({
          demands: {
            demand: {
              listPrice: true,
              positionPrice: true,
              positionModalPrice: true,
              customerDebt: true,
              sum: true,
              allSum: true,
              date: true
            },
            demandReturn: {
              listPrice: true,
              positionPrice: true,
              positionModalPrice: true,
              customerDebt: true,
              sum: true,
              allSum: true,
              date: true
            },
            demandToPayment: {
              customerDebt: true
            },
            stockBalance: {
              supplyBalance: true
            },
          },
        });
      }

      await api('marks/get.php', { token }).then(element => {
        if (element?.List) setMarks(element.List);
      }).catch(err => console.log(err));

      const permissionString = await AsyncStorageWrapper.getItem('perlist');
      if (permissionString !== null) {
        setPermissions(JSON.parse(permissionString));
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setIsInitialized(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--adm-color-background)'
      }}>
        <SpinLoading color='primary' style={{ '--size': '48px' }} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/home' element={<Home />} />

      {/* Göstəricilər */}
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/catalog/*' element={<CatalogStack />} />

      {/* Məhsullar */}
      <Route path='/sub_product/*' element={<ProductStack />} />
      <Route path='/inventory/*' element={<InventoryStack />} />
      <Route path='/stockbalance/*' element={<StockBalanceStack />} />
      <Route path='/loss/*' element={<LossStack />} />
      <Route path='/enter/*' element={<EnterStack />} />
      <Route path='/move/*' element={<MoveStack />} />

      {/* Alışlar */}
      <Route path='/supply/*' element={<SupplyStack />} />
      <Route path='/supplyreturns/*' element={<SupplyReturnStack />} />

      {/* Satışlar */}
      <Route path='/demand/*' element={<DemandStack />} />
      <Route path='/demandreturns/*' element={<DemandReturnStack />} />

      {/* Tərəf-müqabilləri */}
      <Route path='/customer/*' element={<CustomerStack />} />

      {/* Maliyyə */}
      <Route path='/page_payments/*' element={<PaymentStack />} />
      <Route path='/settlements/*' element={<DebtStack />} />
      <Route path='/cashtransactions/*' element={<CashTransactionStack />} />

      {/* Distributorlar */}
      <Route path='/expeditor/*' element={<ExpeditorStack />} />

      {/* Pərakəndə */}
      <Route path='/shifts/*' element={<ShiftStack />} />
      <Route path='/sale/*' element={<SaleStack />} />
      <Route path='/returns/*' element={<ReturnStack />} />
      <Route path='/credittransaction/*' element={<CreditTransactionStack />} />
      <Route path='/cashins' element={<CashInList />} />
      <Route path='/cashouts' element={<CashOutList />} />

      {/* Hesabatlar */}
      <Route path='/salereports/*' element={<SaleReportStack />} />
      <Route path='/profit' element={<Profit />} />
      <Route path='/dailyreports' element={<DailyProfits />} />
      <Route path='/comprehensive' element={<Comprehensive />} />
      <Route path='/producttransactions/*' element={<ProductTransactionsStack />} />
      <Route path='/cashes/*' element={<CasheStack />} />
      <Route path='/customerorders/*' element={<CustomerOrderStack />} />

      {/* Profile */}
      <Route path='/profile' element={<Profile />} />
      <Route path='/settings/*' element={<SettingStack />} />

      <Route path='/print-and-share' element={<PrintAndShare />} />
      <Route path='/filter' element={<Filter />} />
    </Routes>
  );
};

export default MainStack;