import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTheme from '../shared/theme/useTheme';
import { IoHome, IoDocumentText, IoEnter, IoCube, IoCash, IoMenu, IoSyncCircle } from 'react-icons/io5';
import { AiOutlineDashboard, AiOutlineShoppingCart, AiOutlineDownload, AiOutlineUpload, AiOutlineUser, AiOutlineWallet, AiOutlineLineChart } from 'react-icons/ai';
import { FaBoxArchive, FaTrashArrowUp, FaWarehouse, FaCartArrowDown, FaCartFlatbedSuitcase, FaCartShopping, FaUsers, FaIdBadge, FaCalculator, FaChartBar, FaCalendarDays, FaChalkboardUser, FaCashRegister, FaBoxesPacking, FaClipboardList, FaUpload as FaUpload5 } from 'react-icons/fa6';
import { MdPayments, MdAssuredWorkload } from 'react-icons/md';
import { BsPeopleFill, BsBank, BsCaretRightFill, BsDatabaseExclamation, BsBookHalf, BsFileEarmarkText, BsArchive, BsClockHistory, BsClockFill } from 'react-icons/bs';
import { RiDownloadLine, RiUploadLine, RiTimerFlashLine } from 'react-icons/ri';
import { HiShoppingBag } from 'react-icons/hi';
import AsyncStorage from './../services/AsyncStorageWrapper';
import useGlobalStore from './../shared/data/zustand/useGlobalStore';
import permission_ver from './../services/permissionVerification';
import ErrorMessage from '../shared/ui/RepllyMessage/ErrorMessage';
import Line from '../shared/ui/Line';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();

  const permissions = useGlobalStore(state => state.permissions);
  const setPermissions = useGlobalStore(state => state.setPermissions);
  const setMarks = useGlobalStore(state => state.setMarks);
  const setLocal = useGlobalStore(state => state.setLocal);

  const theme = useTheme();
  const [height, setHeight] = useState(0);

  const [selectedId, setSelectedId] = useState(2);
  const [childsState, setChildsState] = useState(null);
  const [parentState, setParentState] = useState([]);

  let iconSize = 16;
  let iconColor = theme.black;

  const childs = {
    1: [
      {
        title: 'Əsas',
        name: 'dashboard',
        show: true,
        icon: <IoHome size={iconSize} color={iconColor} />,
      },
      {
        title: 'Kataloq',
        name: "catalog",
        show: true,
        icon: <IoDocumentText size={iconSize} color={iconColor} />,
      },
    ],
    2: [
      {
        title: "Məhsul və Xidmətlər",
        name: "sub_product",
        show: true,
        icon: <FaBoxArchive size={iconSize} color={iconColor} />,
      },
      {
        title: "Daxilolmalar",
        name: 'enter',
        show: true,
        icon: <IoEnter size={iconSize} color={iconColor} />,
      },
      {
        title: "Silinmələr",
        name: "loss",
        show: true,
        icon: <FaTrashArrowUp size={iconSize} color={iconColor} />,
      },
      {
        title: 'Yerdəyişmələr',
        name: "move",
        show: true,
        icon: <IoSyncCircle size={iconSize} color={iconColor} />,
      },
      {
        title: 'Inventarizasiya',
        name: "inventory",
        show: true,
        icon: <FaWarehouse size={iconSize} color={iconColor} />,
      },
      {
        title: 'Anbar qalığı',
        name: "stockbalance",
        show: true,
        icon: <IoCube size={iconSize} color={iconColor} />,
      }
    ],
    3: [
      {
        title: 'Alışlar',
        name: "supply",
        show: true,
        icon: <RiDownloadLine size={iconSize} color={iconColor} />,
      },
      {
        title: "Alışların iadəsi",
        name: 'supplyreturns',
        show: true,
        icon: <RiUploadLine size={iconSize} color={iconColor} />,
      },
      {
        title: "Sifarişlər",
        name: "purchaseorde",
        show: true,
        icon: <HiShoppingBag size={iconSize} color={iconColor} />,
      }
    ],
    4: [
      {
        title: "Satışlar",
        name: "demand",
        show: true,
        icon: <FaCartArrowDown size={iconSize} color={iconColor} />,
      },
      {
        title: "Satışların geriqaytarması",
        name: "demandreturns",
        show: true,
        icon: <FaCartFlatbedSuitcase size={iconSize} color={iconColor} />,
      },
      {
        title: "Sifarişlər",
        name: "customerorders",
        show: true,
        icon: <FaCartShopping size={iconSize} color={iconColor} />,
      }
    ],
    5: [
      {
        title: "Tərəf-müqabil",
        name: "customer",
        show: true,
        icon: <FaUsers size={iconSize} color={iconColor} />,
      },
      {
        title: "Əməkdaşlar",
        name: "employees",
        show: true,
        icon: <FaIdBadge size={iconSize} color={iconColor} />,
      },
      {
        title: "İşçilik",
        name: "employeesalaries",
        show: true,
        icon: <BsPeopleFill size={iconSize} color={iconColor} />,
      },
      {
        title: "Əmək ödənişləri",
        name: "employeepayments",
        show: true,
        icon: <MdAssuredWorkload size={iconSize} color={iconColor} />,
      },
      {
        title: "Qarşılıqlı hesabat",
        name: "employeesettlements",
        show: true,
        icon: <FaCalculator size={iconSize} color={iconColor} />,
      }
    ],
    6: [
      {
        title: "Ödənişlər",
        name: "page_payments",
        show: true,
        icon: <MdPayments size={iconSize} color={iconColor} />,
      },
      {
        title: "Borclar",
        name: "settlements",
        show: true,
        icon: <BsPeopleFill size={iconSize} color={iconColor} />,
      },
      {
        title: "Transferlər",
        name: "cashtransactions",
        show: true,
        icon: <BsBank size={iconSize} color={iconColor} />,
      },
      {
        title: "Korrektlər",
        name: "correct",
        show: true,
        icon: <IoDocumentText size={iconSize} color={iconColor} />,
      }
    ],
    7: [
      {
        title: "Distributorlar",
        name: "expeditor",
        show: true,
        icon: <AiOutlineDashboard size={iconSize} color={iconColor} />,
      },
      {
        title: 'Anbar qalığı',
        name: "stockbalance",
        show: true,
        icon: <IoCube size={iconSize} color={iconColor} />,
      }
    ],
    8: [
      {
        title: "Növbələr",
        name: "shifts",
        show: true,
        icon: <BsClockHistory size={iconSize} color={iconColor} />,
      },
      {
        title: "Satışlar",
        name: "sale",
        show: true,
        icon: <BsDatabaseExclamation size={iconSize} color={iconColor} />,
      },
      {
        title: "Qaytarmalar",
        name: "returns",
        show: true,
        icon: <RiTimerFlashLine size={iconSize} color={iconColor} />,
      },
      {
        title: "Ödənişlər",
        name: "credittransaction",
        show: true,
        icon: <IoCash size={iconSize} color={iconColor} />,
      },
      {
        title: "Kassa Mədaxilləri",
        name: "cashins",
        show: true,
        icon: <FaCashRegister size={iconSize} color={iconColor} />,
      },
      {
        title: "Kassa Məxaricləri",
        name: 'cashouts',
        show: true,
        icon: <FaUpload5 size={iconSize} color={iconColor} />,
      },
    ],
    9: [
      {
        title: "Mənfəət",
        name: "salereports",
        show: true,
        icon: <AiOutlineDashboard size={iconSize} color={iconColor} />,
      },
      {
        title: "Mənfəət və Zərər",
        name: "profit",
        show: true,
        icon: <FaChartBar size={iconSize} color={iconColor} />,
      },
      {
        title: "Gündəlik hesabatlar",
        name: "dailyreports",
        show: true,
        icon: <FaCalendarDays size={iconSize} color={iconColor} />,
      },
      {
        title: "Təchizatçı hesabatı",
        name: "comprehensive",
        show: true,
        icon: <FaChalkboardUser size={iconSize} color={iconColor} />,
      },
      {
        title: "Dövriyyə",
        name: "producttransactions",
        show: true,
        icon: <BsBookHalf size={iconSize} color={iconColor} />,
      },
      {
        title: "Hesablar",
        name: "cashes",
        show: true,
        icon: <BsFileEarmarkText size={iconSize} color={iconColor} />,
      }
    ],
    10: [
      {
        title: "Məhsullar",
        name: 'productionproducts',
        show: true,
        icon: <FaBoxesPacking size={iconSize} color={iconColor} />,
      },
      {
        title: "Tərkiblər",
        name: "recipe",
        show: true,
        icon: <FaClipboardList size={iconSize} color={iconColor} />,
      },
      {
        title: "Köhnə istehsalat",
        name: "manufactures",
        show: true,
        icon: <BsClockHistory size={iconSize} color={iconColor} />,
      },
      {
        title: "İstehsal Sifarişləri",
        name: "productionorders",
        show: true,
        icon: <BsClockFill size={iconSize} color={iconColor} />,
      },
      {
        title: "İstehsal",
        name: "productions",
        show: true,
        icon: <BsArchive size={iconSize} color={iconColor} />,
      },
    ]
  };

  const parent = [
    {
      name: "Göstəricilər",
      id: 1,
      image: 'dashboard',
      show: true,
      value: "page_dashboards"
    },
    {
      name: 'Məhsullar',
      id: 2,
      image: 'inbox',
      show: true,
      value: "page_products"
    },
    {
      name: "Alışlar",
      id: 3,
      image: 'download',
      show: true,
      value: "page_supplies"
    },
    {
      name: "Satışlar",
      id: 4,
      image: 'upload',
      show: true,
      value: "page_demands"
    },
    {
      name: "Tərəf-müqabil",
      id: 5,
      image: 'user',
      show: true,
      value: "page_customers"
    },
    {
      name: "Maliyyə",
      id: 6,
      image: 'wallet',
      show: true,
      value: "page_transactions"
    },
    {
      name: "Distributorlar",
      id: 7,
      show: true,
      value: 'handover',
      image: 'isv'
    },
    {
      name: 'Pərakəndə',
      id: 8,
      image: 'shoppingcart',
      show: true,
      value: 'sales'
    },
    {
      name: "Hesabatlar",
      id: 9,
      image: 'linechart',
      show: true,
      value: 'page_reports'
    },
  ];

  const getParentIcon = (imageName, isSelected) => {
    const color = isSelected ? theme.primary : theme.black;
    const size = 25;
    switch (imageName) {
      case 'dashboard': return <AiOutlineDashboard size={size} color={color} />;
      case 'inbox': return <FaBoxArchive size={size} color={color} />;
      case 'download': return <AiOutlineDownload size={size} color={color} />;
      case 'upload': return <AiOutlineUpload size={size} color={color} />;
      case 'user': return <AiOutlineUser size={size} color={color} />;
      case 'wallet': return <AiOutlineWallet size={size} color={color} />;
      case 'isv': return <AiOutlineDashboard size={size} color={color} />;
      case 'shoppingcart': return <AiOutlineShoppingCart size={size} color={color} />;
      case 'linechart': return <AiOutlineLineChart size={size} color={color} />;
      default: return <AiOutlineDashboard size={size} color={color} />;
    }
  };

  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.bg,
      minHeight: '100vh'
    },
    header: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10
    },
    headerText: {
      fontSize: 18,
      color: theme.stable.white
    },
    parentContainer: {
      width: '100%',
      minHeight: 85,
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'row',
      gap: 15,
      alignItems: 'center',
      paddingLeft: 5,
      overflowX: 'auto',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    },
    item: {
      minHeight: 70,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      cursor: 'pointer',
      padding: '5px 10px',
      background: 'none',
      border: 'none'
    },
    parentText: {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 5,
      paddingRight: 5,
      borderRadius: 10,
      fontSize: 12.5,
      whiteSpace: 'nowrap'
    },
    childContainer: {
      backgroundColor: theme.bg,
      flex: 1,
      overflowY: 'auto'
    },
    childItem: {
      width: '100%',
      height: 60,
      paddingLeft: 10,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      textAlign: 'left'
    },
    childText: {
      fontSize: 16,
      color: theme.black
    },
    childIconContainer: {
      width: 40,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.input.greyWhite,
      borderRadius: 10
    },
    menuButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 5
    },
    loadingContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    spinner: {
      width: 40,
      height: 40,
      border: `3px solid ${theme.input.grey}`,
      borderTop: `3px solid ${theme.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  const permissionVerification = async () => {
    let localAsync = await AsyncStorage.getItem('local_per');
    setLocal(localAsync != null ? JSON.parse(localAsync) : null);

    await api('marks/get.php', {
      token: await AsyncStorage.getItem('token')
    }).then(element => {
      setMarks(element.List);
    });

    let permissionString = await AsyncStorage.getItem("perlist");
    if (permissionString !== null) {
      let permissionData = JSON.parse(permissionString);

      let c_state = { ...childs };
      let p_state = [...parent];

      for (let p = 0; p < p_state.length; p++) {
        if (!permission_ver(permissionData, p_state[p].value, 'R')) {
          p_state[p].show = false;
        }
        for (let c = 0; c < c_state[p_state[p].id].length; c++) {
          let list = [...c_state[p_state[p].id]];
          if (!permission_ver(permissionData, list[c].name, 'R')) {
            list[c].show = false;
          }
          c_state[p_state[p].id] = list;
        }
      }

      let selectedId_data = selectedId;
      let index = p_state.findIndex(element => element.value === "page_products");
      if (!p_state[index].show) {
        let firstShowIsTrue = p_state.findIndex(element => element.show === true);
        setSelectedId(p_state[firstShowIsTrue].id);
        selectedId_data = p_state[firstShowIsTrue].id;
      }

      if (c_state[selectedId_data][0]) {
        let c_state_length = 0;
        for (let i = 0; i < c_state[selectedId_data].length; i++) {
          if (c_state[selectedId_data][i].show) {
            c_state_length += 1;
          }
        }
        setHeight(c_state_length * 61);
      }

      setChildsState(c_state);
      setParentState(p_state);
      setPermissions(permissionData);
    }
  };

  useEffect(() => {
    setHeight(childs[selectedId].length * 61);
    permissionVerification();
  }, []);

  const handleChildClick = (element) => {
    if (permission_ver(permissions, element.name, 'R')) {
      navigate(`/${element.name}`);
    } else {
      ErrorMessage("Sizin bu səhifəyə girməyinizə icazə yoxudr!");
    }
  };

  const handleParentClick = (element) => {
    setSelectedId(element.id);
    if (childsState[element.id][0]) {
      let c_state_length = 0;
      for (let i = 0; i < childsState[element.id].length; i++) {
        if (childsState[element.id][i].show) {
          c_state_length += 1;
        }
      }
      setHeight(c_state_length * 61);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {parentState.length > 0 ? (
          <span style={styles.headerText}>
            {parentState[parentState.findIndex(rel => rel.id === selectedId)]?.name}
          </span>
        ) : (
          <span style={styles.headerText}></span>
        )}
        <button style={styles.menuButton} onClick={() => navigate('/profile')}>
          <IoMenu size={25} color={theme.stable.white} />
        </button>
      </div>

      {parentState.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ ...styles.childContainer, height: height }}>
            {childsState[selectedId].map((element, index) => {
              return (
                element.show ? (
                  <div key={element.name}>
                    <button
                      onClick={() => handleChildClick(element)}
                      style={styles.childItem}
                    >
                      <div style={styles.childIconContainer}>
                        {element.icon}
                      </div>
                      <span style={styles.childText}>{element.title}</span>
                    </button>
                    <Line width={'95%'} />
                  </div>
                ) : null
              );
            })}
          </div>

          <div style={styles.parentContainer}>
            {parentState.map((element) => {
              return (
                element.show ? (
                  <button
                    key={element.id}
                    onClick={() => handleParentClick(element)}
                    style={styles.item}
                  >
                    {getParentIcon(element.image, element.id === selectedId)}
                    <span style={{
                      ...styles.parentText,
                      backgroundColor: element.id === selectedId ? theme.primary : theme.whiteGrey,
                      color: element.id === selectedId ? theme.bg : theme.stable.black
                    }}>
                      {element.name}
                    </span>
                  </button>
                ) : null
              );
            })}
          </div>
        </div>
      ) : (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
        </div>
      )}
    </div>
  );
};

export default Home;
