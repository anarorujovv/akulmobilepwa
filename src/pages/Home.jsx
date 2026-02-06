import { ActivityIndicator, Linking, PanResponder, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../shared/theme/useTheme'
import { TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable } from '@react-native-material/core';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGlobalStore from './../shared/data/zustand/useGlobalStore';
import permission_ver from './../services/permissionVerification';
import ErrorMessage from '../shared/ui/RepllyMessage/ErrorMessage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Line from '../shared/ui/Line';
import api from '../services/api';

const Home = ({ route, navigation }) => {

  const permissions = useGlobalStore(state => state.permissions);
  const setPermissions = useGlobalStore(state => state.setPermissions);
  const setMarks = useGlobalStore(state => state.setMarks);
  const setLocal = useGlobalStore(state => state.setLocal);

  const theme = useTheme();
  const height = useSharedValue(0);

  /**
   * Stil obyekti
   * @constant styles
   * @type {Object}
   * @property {Object} header - Başlıq panelinin stilleri
   * @property {Object} headerText - Başlıq mətninin stilleri
   * @property {Object} parentContainer - Əsas konteyner stilleri
   * @property {Object} item - Menu elementlərinin stilleri
   */

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
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
    footer: {

    },
    parentContainer: {
      width: '100%',
      height: 85,
      shadowColor: 'black',
      backgroundColor: theme.bg,
      shadowOpacity: 0.9,
      shadowOffset: {
        width: 0,
        height: 10
      },
      flexDirection: 'row',
      gap: 15,
      alignItems: 'center',
      paddingLeft: 5,
    },
    item: {
      height: 70,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 5,
    },
    parentImage: {
      width: 20,
      height: 20
    },
    parentText: {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 5,
      paddingRight: 5,
      borderRadius: 10,
      color: theme.stable.black,
      fontSize: 12.5
    },

    childContainer: {
      backgroundColor: theme.bg,
      height: height
    },
    childItem: {
      width: '100%',
      height: 60,
      paddingLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    childText: {
      fontSize: 16,
      color: theme.black
    }
  })

  const [selectedId, setSelectedId] = useState(2);

  let iconSize = 16;
  let iconColor = theme.black;

  /**
   * Menyu elementləri
   * @constant childs
   * @type {Object}
   * @property {Array} 1 - Əsas menyu elementləri
   * @property {Array} 2 - Anbar əməliyyatları
   * @property {Array} 3 - Alış əməliyyatları
   * @property {Array} 4 - Satış əməliyyatları
   * @property {Array} 5 - İşçi və müştəri əməliyyatları
   * @property {Array} 6 - Maliyyə əməliyyatları
   */

  const childs = {
    1: [
      {
        title: 'Əsas',
        name: 'dashboard',
        show: true,
        icon: <Ionicons name="home" size={iconSize} color={iconColor} />,
      },
      {
        title: 'Kataloq',
        name: "catalog",
        show: true,
        icon: <Ionicons name="document-text" size={iconSize} color={iconColor} />,
      },
      // {
      //   title: 'Sənədlər',
      //   name: "docs",
      //   show: true,
      //   icon: <Ionicons name="documents" size={iconSize} color={iconColor} />,
      // },
      // {
      //   title: 'Səbət',
      //   name: "trash",
      //   show: true,
      //   icon: <Ionicons name="trash" size={iconSize} color={iconColor} />,
      // },
      // {
      //   title: 'Audit',
      //   name: "audit",
      //   show: true,
      //   icon: <MaterialCommunityIcons name="police-station" size={iconSize} color={iconColor} />,
      // }
    ],
    2: [
      {
        title: "Məhsul və Xidmətlər",
        name: "sub_product",
        show: true,
        icon: <FontAwesome6 name="box-archive" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Daxilolmalar",
        name: 'enter',
        show: true,
        icon: <Ionicons name="enter" size={iconSize} color={iconColor} />, // Ionicons
      },
      {
        title: "Silinmələr",
        name: "loss",
        show: true,
        icon: <FontAwesome6 name="trash-arrow-up" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: 'Yerdəyişmələr',
        name: "move",
        show: true,
        icon: <Ionicons name="sync-circle" size={iconSize} color={iconColor} />, // Ionicons
      },
      {
        title: 'Inventarizasiya',
        name: "inventory",
        show: true,
        icon: <FontAwesome6 name="warehouse" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: 'Anbar qalığı',
        name: "stockbalance",
        show: true,
        icon: <Ionicons name="cube" size={iconSize} color={iconColor} />, // Ionicons
      }
    ],
    3: [
      {
        title: 'Alışlar',
        name: "supply",
        show: true,
        icon: <Entypo name="download" size={iconSize} color={iconColor} />, // Entypo
      },
      {
        title: "Alışların iadəsi",
        name: 'supplyreturns',
        show: true,
        icon: <Entypo name="upload" size={iconSize} color={iconColor} />, // Entypo
      },
      {
        title: "Sifarişlər",
        name: "purchaseorde",
        show: true,
        icon: <FontAwesome6 name="bag-shopping" size={iconSize} color={iconColor} />, // FontAwesome6
      }
    ],
    4: [
      {
        title: "Satışlar",
        name: "demand",
        show: true,
        icon: <FontAwesome6 name="cart-arrow-down" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Satışların geriqaytarması",
        name: "demandreturns",
        show: true,
        icon: <FontAwesome6 name="cart-flatbed-suitcase" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Sifarişlər",
        name: "customerorders",
        show: true,
        icon: <FontAwesome6 name="cart-shopping" size={iconSize} color={iconColor} />, // FontAwesome6
      }
    ],
    5: [
      {
        title: "Tərəf-müqabil",
        name: "customer",
        show: true,
        icon: <FontAwesome6 name="users" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Əməkdaşlar",
        name: "employees",
        show: true,
        icon: <FontAwesome6 name="id-badge" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "İşçilik",
        name: "employeesalaries",
        show: true,
        icon: <MaterialCommunityIcons name="account-network" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
      {
        title: "Əmək ödənişləri",
        name: "employeepayments",
        show: true,
        icon: <MaterialIcons name="assured-workload" size={iconSize} color={iconColor} />, // MaterialIcons
      },
      {
        title: "Qarşılıqlı hesabat",
        name: "employeesettlements",
        show: true,
        icon: <FontAwesome6 name="calculator" size={iconSize} color={iconColor} />, // FontAwesome6
      }
    ],
    6: [
      {
        title: "Ödənişlər",
        name: "page_payments",
        show: true,
        icon: <MaterialIcons name="payments" size={iconSize} color={iconColor} />, // MaterialIcons
      },
      {
        title: "Borclar",
        name: "settlements",
        show: true,
        icon: <MaterialCommunityIcons name="account-cash" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
      {
        title: "Transferlər",
        name: "cashtransactions",
        show: true,
        icon: <MaterialCommunityIcons name="bank-transfer" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
      {
        title: "Korrektlər",
        name: "correct",
        show: true,
        icon: <Ionicons name="document-text" size={iconSize} color={iconColor} />, // Ionicons
      }
    ],
    7:
      [
        {
          title: "Distributorlar",
          name: "expeditor",
          show: true,
          icon: <AntDesign name="isv" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
        }, {
          title: 'Anbar qalığı',
          name: "stockbalance",
          show: true,
          icon: <Ionicons name="cube" size={iconSize} color={iconColor} />, // Ionicons
        }
      ],
    8:
      [
        {
          title: "Növbələr",
          name: "shifts",
          show: true,
          icon: <MaterialCommunityIcons name="car-shift-pattern" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
        },
        {
          title: "Satışlar",
          name: "sale",
          show: true,
          icon: <MaterialCommunityIcons name="database-export" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
        },
        {
          title: "Qaytarmalar",
          name: "returns",
          show: true,
          icon: <Entypo name="back-in-time" size={iconSize} color={iconColor} />, // Entypo
        },
        {
          title: "Ödənişlər",
          name: "credittransaction",
          show: true,
          icon: <Ionicons name="cash" size={iconSize} color={iconColor} />, // Ionicons
        },
        {
          title: "Kassa Mədaxilləri",
          name: "cashins",
          show: true,
          icon: <FontAwesome6 name="cash-register" size={iconSize} color={iconColor} />, // FontAwesome6
        },
        {
          title: "Kassa Məxaricləri",
          name: 'cashouts',
          show: true,
          icon: <FontAwesome5 name="upload" size={iconSize} color={iconColor} />, // FontAwesome5
        },
        // {
        //   title: "Satış nöqtələri",
        //   name: "salepoints",
        //   show: true,
        //   icon: <FontAwesome6 name="map-location-dot" size={iconSize} color={iconColor} />, // FontAwesome6
        // }
      ],
    9: [
      {
        title: "Mənfəət",
        name: "salereports",
        show: true,
        icon: <MaterialCommunityIcons name="desktop-mac-dashboard" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
      {
        title: "Mənfəət və Zərər",
        name: "profit",
        show: true,
        icon: <FontAwesome6 name="chart-bar" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Gündəlik hesabatlar",
        name: "dailyreports",
        show: true,
        icon: <FontAwesome6 name="calendar-days" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Təchizatçı hesabatı",
        name: "comprehensive",
        show: true,
        icon: <FontAwesome6 name="chalkboard-user" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Dövriyyə",
        name: "producttransactions",
        show: true,
        icon: <MaterialCommunityIcons name="book-sync" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
      {
        title: "Hesablar",
        name: "cashes",
        show: true,
        icon: <MaterialCommunityIcons name="page-next" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      }
    ],
    10: [
      {
        title: "Məhsullar",
        name: 'productionproducts',
        show: true,
        icon: <FontAwesome6 name="boxes-packing" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Tərkiblər",
        name: "recipe",
        show: true,
        icon: <FontAwesome6 name="clipboard-list" size={iconSize} color={iconColor} />, // FontAwesome6
      },
      {
        title: "Köhnə istehsalat",
        name: "manufactures",
        show: true,
        icon: <MaterialCommunityIcons name="history" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
      {
        title: "İstehsal Sifarişləri",
        name: "productionorders",
        show: true,
        icon: <MaterialCommunityIcons name="archive-clock" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
      {
        title: "İstehsal",
        name: "productions",
        show: true,
        icon: <MaterialCommunityIcons name="archive" size={iconSize} color={iconColor} />, // MaterialCommunityIcons
      },
    ]
    // ... existing code ...
  }

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
    // {
    //   name: "İstehsalat",
    //   id: 10,
    //   image: "fork",
    //   show: true,
    //   value: 'page_productions'
    // }
  ]

  const [childsState, setChildsState] = useState(null);
  const [parentState, setParentState] = useState([]);

  const permissionVerification = async () => {
    let localAsync = await AsyncStorage.getItem('local_per');
    setLocal(localAsync != null ? JSON.parse(localAsync) : null);


    await api('marks/get.php', {
      token: await AsyncStorage.getItem('token')
    }).then(element => {
      setMarks(element.List);
    })

    let permissionString = await AsyncStorage.getItem("perlist");
    if (permissionString !== null) {
      let permissionData = JSON.parse(permissionString);

      let c_state = childs;
      let p_state = parent;
      for (p = 0; p < p_state.length; p++) {
        if (!permission_ver(permissionData, p_state[p].value, 'R')) {
          p_state[p].show = false;
        }
        for (let c = 0; c < c_state[p_state[p].id].length; c++) {
          let list = c_state[p_state[p].id];
          if (!permission_ver(permissionData, list[c].name, 'R')) {
            list[c].show = false;
          }
          c_state[p_state[p].id] = list;
        }
      }

      let selectedId_data = selectedId;

      let index = p_state.findIndex(element => element.value == "page_products");
      if (!p_state[index].show) {
        let firstShowIsTrue = p_state.findIndex(element => element.show == true);


        setSelectedId(p_state[firstShowIsTrue].id);
        selectedId_data = p_state[firstShowIsTrue].id;
      }

      if (c_state[selectedId_data][0]) {
        let c_state_length = 0;
        for (let index = 0; index < c_state[selectedId_data].length; index++) {
          if (c_state[selectedId_data][index].show) {
            c_state_length += 1
          }
        }
        height.value = withSpring(c_state_length * 61)
      }

      setChildsState(c_state);
      setParentState(p_state);

      setPermissions(permissionData);
    }
  }

  useEffect(() => {
    height.value = withSpring(childs[selectedId].length * 61);
    permissionVerification();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'space-between' }}>

      <>
        <View style={styles.header}>
          {
            parentState.length > 0 ?
              <Text style={styles.headerText}>{parentState[parentState.findIndex(rel => rel.id == selectedId)].name}</Text>
              :
              ""
          }
          <TouchableOpacity onPress={() => {
            navigation.navigate('profile');
          }}>
            <Ionicons name='menu' size={25} color={theme.stable.white} />
          </TouchableOpacity>
        </View>
        {
          parentState.length > 0 ?

            <View style={styles.footer}>
              <Animated.View style={styles.childContainer}>
                {
                  childsState[selectedId].map((element, index) => {
                    return (
                      element.show ?
                        <View key={element.name}>
                          <Pressable onPress={() => {
                            if (permission_ver(permissions, element.name, 'R')) {
                              navigation.navigate(element.name, {
                                name: element.name
                              })
                            } else {
                              ErrorMessage("Sizin bu səhifəyə girməyinizə icazə yoxudr!")
                            }
                          }} key={index + 1} style={styles.childItem}>
                            <View style={{
                              width: 40,
                              height: 40,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: theme.input.greyWhite,
                              borderRadius: 10,
                            }}>
                              {element.icon}
                            </View>
                            <Text style={styles.childText}>{element.title}</Text>
                          </Pressable>
                          <Line width={'95%'} />
                        </View>
                        :
                        ''
                    )
                  })
                }
              </Animated.View>

              <ScrollView horizontal >
                <View style={styles.parentContainer}>

                  {
                    parentState.map((element, index) => {
                      return (
                        element.show ?
                          <TouchableOpacity onPress={() => {
                            setSelectedId(element.id);

                            if (childsState[element.id][0]) {
                              let c_state_length = 0;
                              for (let index = 0; index < childsState[element.id].length; index++) {
                                if (childsState[element.id][index].show) {
                                  c_state_length += 1
                                }
                              }
                              height.value = withSpring(c_state_length * 61)
                            }
                          }} key={element.id} style={styles.item}>
                            <AntDesign name={element.image} size={25} color={element.id == selectedId ? theme.primary : theme.black} />
                            <Text style={[styles.parentText, {
                              backgroundColor: element.id == selectedId ? theme.primary : theme.whiteGrey,
                              color: element.id == selectedId ? theme.bg : theme.stable.black
                            }]}>{element.name}</Text>
                          </TouchableOpacity>

                          :
                          ''
                      )
                    })
                  }
                </View>
              </ScrollView>

            </View>
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={40} color={theme.primary} />
            </View>
        }
      </>

    </View>
  )
}

export default Home
