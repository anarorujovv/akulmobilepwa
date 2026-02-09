import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, List, CapsuleTabs, SpinLoading, Divider, Space } from 'antd-mobile';
import {
  HomeOutlined,
  FileTextOutlined,
  ImportOutlined,
  AppstoreOutlined,
  DollarOutlined,
  MenuOutlined,
  SyncOutlined,
  InboxOutlined,
  DeleteOutlined,
  ShopOutlined,
  DownloadOutlined,
  UploadOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  RollbackOutlined,
  TeamOutlined,
  IdcardOutlined,
  UserOutlined,
  CalculatorOutlined,
  WalletOutlined,
  BankOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  HistoryOutlined,
  PayCircleOutlined,
  ContainerOutlined,
  LineChartOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ProfileOutlined,
  BookOutlined,
  FileOutlined,
  ExperimentOutlined,
  ScheduleOutlined,
  BuildOutlined,
  FundProjectionScreenOutlined
} from '@ant-design/icons';
import AsyncStorage from './../services/AsyncStorageWrapper';
import useGlobalStore from './../shared/data/zustand/useGlobalStore';
import permission_ver from './../services/permissionVerification';
import ErrorMessage from '../shared/ui/RepllyMessage/ErrorMessage';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();

  const permissions = useGlobalStore(state => state.permissions);
  const setPermissions = useGlobalStore(state => state.setPermissions);
  const setMarks = useGlobalStore(state => state.setMarks);
  const setLocal = useGlobalStore(state => state.setLocal);

  const [selectedId, setSelectedId] = useState(2);
  const [childsState, setChildsState] = useState(null);
  const [parentState, setParentState] = useState([]);
  const [loading, setLoading] = useState(true);

  const childs = {
    1: [
      { title: 'Əsas', name: 'dashboard', show: true, icon: <HomeOutlined /> },
      { title: 'Kataloq', name: 'catalog', show: true, icon: <FileTextOutlined /> },
    ],
    2: [
      { title: 'Məhsul və Xidmətlər', name: 'sub_product', show: true, icon: <InboxOutlined /> },
      { title: 'Daxilolmalar', name: 'enter', show: true, icon: <ImportOutlined /> },
      { title: 'Silinmələr', name: 'loss', show: true, icon: <DeleteOutlined /> },
      { title: 'Yerdəyişmələr', name: 'move', show: true, icon: <SyncOutlined /> },
      { title: 'Inventarizasiya', name: 'inventory', show: true, icon: <ShopOutlined /> },
      { title: 'Anbar qalığı', name: 'stockbalance', show: true, icon: <AppstoreOutlined /> }
    ],
    3: [
      { title: 'Alışlar', name: 'supply', show: true, icon: <DownloadOutlined /> },
      { title: 'Alışların iadəsi', name: 'supplyreturns', show: true, icon: <UploadOutlined /> },
      { title: 'Sifarişlər', name: 'purchaseorde', show: true, icon: <ShoppingOutlined /> }
    ],
    4: [
      { title: 'Satışlar', name: 'demand', show: true, icon: <ShoppingCartOutlined /> },
      { title: 'Satışların geriqaytarması', name: 'demandreturns', show: true, icon: <RollbackOutlined /> },
      { title: 'Sifarişlər', name: 'customerorders', show: true, icon: <ShoppingOutlined /> }
    ],
    5: [
      { title: 'Tərəf-müqabil', name: 'customer', show: true, icon: <TeamOutlined /> },
      { title: 'Əməkdaşlar', name: 'employees', show: true, icon: <IdcardOutlined /> },
      { title: 'İşçilik', name: 'employeesalaries', show: true, icon: <UserOutlined /> },
      { title: 'Əmək ödənişləri', name: 'employeepayments', show: true, icon: <PayCircleOutlined /> },
      { title: 'Qarşılıqlı hesabat', name: 'employeesettlements', show: true, icon: <CalculatorOutlined /> }
    ],
    6: [
      { title: 'Ödənişlər', name: 'page_payments', show: true, icon: <DollarOutlined /> },
      { title: 'Borclar', name: 'settlements', show: true, icon: <TeamOutlined /> },
      { title: 'Transferlər', name: 'cashtransactions', show: true, icon: <BankOutlined /> },
      { title: 'Korrektlər', name: 'correct', show: true, icon: <FileTextOutlined /> }
    ],
    7: [
      { title: 'Distributorlar', name: 'expeditor', show: true, icon: <DashboardOutlined /> },
      { title: 'Anbar qalığı', name: 'stockbalance', show: true, icon: <AppstoreOutlined /> }
    ],
    8: [
      { title: 'Növbələr', name: 'shifts', show: true, icon: <ClockCircleOutlined /> },
      { title: 'Satışlar', name: 'sale', show: true, icon: <DatabaseOutlined /> },
      { title: 'Qaytarmalar', name: 'returns', show: true, icon: <HistoryOutlined /> },
      { title: 'Ödənişlər', name: 'credittransaction', show: true, icon: <DollarOutlined /> },
      { title: 'Kassa Mədaxilləri', name: 'cashins', show: true, icon: <ContainerOutlined /> },
      { title: 'Kassa Məxaricləri', name: 'cashouts', show: true, icon: <UploadOutlined /> }
    ],
    9: [
      { title: 'Mənfəət', name: 'salereports', show: true, icon: <DashboardOutlined /> },
      { title: 'Mənfəət və Zərər', name: 'profit', show: true, icon: <BarChartOutlined /> },
      { title: 'Gündəlik hesabatlar', name: 'dailyreports', show: true, icon: <CalendarOutlined /> },
      { title: 'Təchizatçı hesabatı', name: 'comprehensive', show: true, icon: <FundProjectionScreenOutlined /> },
      { title: 'Dövriyyə', name: 'producttransactions', show: true, icon: <BookOutlined /> },
      { title: 'Hesablar', name: 'cashes', show: true, icon: <FileOutlined /> }
    ],
    10: [
      { title: 'Məhsullar', name: 'productionproducts', show: true, icon: <ProfileOutlined /> },
      { title: 'Tərkiblər', name: 'recipe', show: true, icon: <ExperimentOutlined /> },
      { title: 'Köhnə istehsalat', name: 'manufactures', show: true, icon: <HistoryOutlined /> },
      { title: 'İstehsal Sifarişləri', name: 'productionorders', show: true, icon: <ScheduleOutlined /> },
      { title: 'İstehsal', name: 'productions', show: true, icon: <BuildOutlined /> }
    ]
  };

  const parent = [
    { name: 'Göstəricilər', id: 1, icon: <DashboardOutlined />, show: true, value: 'page_dashboards' },
    { name: 'Məhsullar', id: 2, icon: <InboxOutlined />, show: true, value: 'page_products' },
    { name: 'Alışlar', id: 3, icon: <DownloadOutlined />, show: true, value: 'page_supplies' },
    { name: 'Satışlar', id: 4, icon: <UploadOutlined />, show: true, value: 'page_demands' },
    { name: 'Tərəf-müqabil', id: 5, icon: <UserOutlined />, show: true, value: 'page_customers' },
    { name: 'Maliyyə', id: 6, icon: <WalletOutlined />, show: true, value: 'page_transactions' },
    { name: 'Distributorlar', id: 7, icon: <DashboardOutlined />, show: true, value: 'handover' },
    { name: 'Pərakəndə', id: 8, icon: <ShoppingCartOutlined />, show: true, value: 'sales' },
    { name: 'Hesabatlar', id: 9, icon: <LineChartOutlined />, show: true, value: 'page_reports' }
  ];

  const permissionVerification = async () => {
    try {
      let localAsync = await AsyncStorage.getItem('local_per');
      setLocal(localAsync != null ? JSON.parse(localAsync) : null);

      await api('marks/get.php', {
        token: await AsyncStorage.getItem('token')
      }).then(element => {
        setMarks(element.List);
      });

      let permissionString = await AsyncStorage.getItem('perlist');
      if (permissionString !== null) {
        let permissionData = JSON.parse(permissionString);
        let c_state = { ...childs };
        let p_state = [...parent];

        for (let p = 0; p < p_state.length; p++) {
          if (!permission_ver(permissionData, p_state[p].value, 'R')) {
            p_state[p].show = false;
          }
          if (c_state[p_state[p].id]) {
            let list = [...c_state[p_state[p].id]];
            for (let c = 0; c < list.length; c++) {
              if (!permission_ver(permissionData, list[c].name, 'R')) {
                list[c].show = false;
              }
            }
            c_state[p_state[p].id] = list;
          }
        }

        let index = p_state.findIndex(element => element.value === 'page_products');
        if (!p_state[index].show) {
          let firstShowIsTrue = p_state.findIndex(element => element.show === true);
          if (firstShowIsTrue !== -1) {
            setSelectedId(p_state[firstShowIsTrue].id);
          }
        }

        setChildsState(c_state);
        setParentState(p_state);
        setPermissions(permissionData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    permissionVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChildClick = (element) => {
    if (permission_ver(permissions, element.name, 'R')) {
      navigate(`/${element.name}`);
    } else {
      ErrorMessage('Sizin bu səhifəyə girməyinizə icazə yoxudr!');
    }
  };

  const getCurrentTitle = () => {
    if (parentState.length > 0) {
      const current = parentState.find(rel => rel.id === selectedId);
      return current?.name || '';
    }
    return '';
  };

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

  const tabs = parentState
    .filter(p => p.show)
    .map(p => ({
      key: p.id.toString(),
      title: p.name,
      icon: p.icon
    }));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--adm-color-background)'
    }}>
      <NavBar
        back={null}
        right={<MenuOutlined style={{ fontSize: 22, color: '#fff' }} onClick={() => navigate('/profile')} />}
        style={{
          '--height': '50px',
          '--border-bottom': 'none',
          backgroundColor: 'var(--adm-color-primary)',
          color: '#fff'
        }}
      >
        {getCurrentTitle()}
      </NavBar>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {childsState && childsState[selectedId] && (
          <List>
            {childsState[selectedId]
              .filter(c => c.show)
              .map((element, index, arr) => (
                <React.Fragment key={element.name}>
                  <List.Item
                    prefix={
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: 'var(--adm-color-fill-content)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        color: 'var(--adm-color-primary)'
                      }}>
                        {element.icon}
                      </div>
                    }
                    onClick={() => handleChildClick(element)}
                    arrow
                  >
                    {element.title}
                  </List.Item>
                  {index < arr.length - 1 && <Divider style={{ margin: 0 }} />}
                </React.Fragment>
              ))}
          </List>
        )}
      </div>

      <CapsuleTabs
        activeKey={selectedId.toString()}
        onChange={(key) => setSelectedId(parseInt(key))}
      >
        {tabs.map(tab => (
          <CapsuleTabs.Tab
            key={tab.key}
            title={
              <Space align='center' style={{ '--gap': '4px' }}>
                {tab.icon}
                <span>{tab.title}</span>
              </Space>
            }
          />
        ))}
      </CapsuleTabs>
    </div>
  );
};

export default Home;
