import { ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { Pressable } from '@react-native-material/core';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import FabButton from '../../shared/ui/FabButton';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import prompt from '../../services/prompt';
import ListItem from '../../shared/ui/list/ListItem';
import { Picker } from '@react-native-picker/picker';
import Line from '../../shared/ui/Line';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';

const PaymentList = ({ route, navigation }) => {

    let theme = useTheme();

    let permissions = useGlobalStore(state => state.permissions);

    const [selectedTime, setSelectedTime] = useState(4);
    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [selectionModal, setSelectionModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [itemSize, setItemSize] = useState(0)
    const [filter, setFilter] = useState({
        dr: 1,
        sr: "Moment",
        pg: 1,
        lm: 20,
        agrigate: 1,
        advance: "hide",
        paydir: "all"
    })

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg,           // Using theme background color
        },
        deleteButton: {
            backgroundColor: theme.red,          // Using theme red color for delete button
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: '100%',
        },
        deleteText: {
            color: theme.stable.white,           // Using theme's stable white for text color
            fontWeight: 'bold',
            fontSize: 16,
        },
        centeredView: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: "rgba(1,1,1,0.2)",  // Transparent overlay, no need for theme integration here
        },
        modalView: {
            width: '100%',
            backgroundColor: theme.stable.white,  // Use theme's white color for the modal background
            borderRadius: 4,
            alignItems: 'center',
            shadowColor: theme.black,             // Use theme's black for shadow color
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            minHeight: 200,
        },
        modalHeader: {
            flexDirection: 'row',
            gap: 10,
            padding: 15,
            width: '100%',
            alignItems: 'center',
            backgroundColor: theme.primary,
        },
        itemContainer: {
            width: '100%',
            paddingLeft: 50,
            height: 50,
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
            display: 'flex',
            flexDirection: 'row'
        },
        itemText: {
            color: theme.black,
            fontSize: 18,
        },
    });

    let selectionData = [
        {
            name: "Mədaxil",
            value: "i"
        },
        {
            name: "Məxaric",
            value: "o"
        },
        {
            name: "Hamısı",
            value: "all"
        }
    ]

    const fetchingDocumentData = useCallback(async () => {
        setIsRefreshing(true);
        let obj = {
            ...filter,
            pg: filter.pg - 1,
            token: await AsyncStorage.getItem('token'),
            paydir: filter.paydir.replace("all", "")
        }
        try {
            const element = await api('transactions/get.php', obj);
            if (element != null) {
                setItemSize(element.Count);
                if (filter.agrigate == 1) {
                    setDocumentsInfo(element);
                }
                setDocuments([...element.List]);
            }
        } catch (err) {
            ErrorMessage(err);
        } finally {
            setIsRefreshing(false);
        }
    }, [filter]);

    const handleDelete = async (id, item) => {
        let url = `${item.Type == "p" ? "payment" : "invoice"}${item.Direct == "i" ? "ins" : "outs"}`
        if (permission_ver(permissions, 'page_payments', 'D')) {
            await api(`${url}/del.php?id=` + id, {
                token: await AsyncStorage.getItem('token')
            }).then(element => {
                if (element != null) {
                    setDocuments([]);
                    fetchingDocumentData();
                }
            }).catch(err => {
                ErrorMessage(err)
            })
        } else {
            ErrorMessage("İcazə yoxdur!")
        }
    }


    const handleDocumentCreate = (type, cost) => {
        setSelectionModal(false);
        let obj = {
            id: null,
            direct: type,
            type: "payment"
        }

        if (cost) {
            obj.cost = true
        }

        navigation.navigate('payment-manage', obj)
    }

    const RenderFooter = () => {
        return (
            documents.length == 20 || filter.pg != 1 ?
                <MyPagination
                    itemSize={itemSize}
                    page={filter.pg}
                    setPage={(e) => {
                        let filterData = { ...filter };
                        filterData.agrigate = 0;
                        filterData.pg = e;
                        setFilter(filterData);
                    }}
                    pageSize={20}
                />
                : ""
        )
    }

    useFocusEffect(
        useCallback(() => {
            setDocuments(null);

            let time = setTimeout(() => {
                fetchingDocumentData();
            }, 300);

            return () => clearTimeout(time);
        }, [filter])
    )

    return (
        <View style={styles.container}>

            <ListPagesHeader
                header={"Ödənişlər"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigation.navigate('filter', {
                        filter: filter,
                        setFilter: setFilter,
                        searchParams: [
                            'documentName',
                            'spendItems',
                            'customers',
                            'cashes',
                            'customerGroups'
                        ],
                        sortList: [
                            {
                                id: 1,
                                label: "Ad",
                                value: 'Name',
                            },
                            {
                                id: 2,
                                label: "Tarix",
                                value: "Moment"
                            },
                            {
                                id: 3,
                                label: 'Tərəf-Müqabil',
                                value: 'CustomerName'
                            },
                            {
                                id: 4,
                                label: 'Hesab',
                                value: 'CashName'
                            },
                            {
                                id: 5,
                                label: "Xərc-Maddəsi",
                                value: 'SpendName'
                            }
                        ]
                    })
                }}
            />

            <Picker
                selectedValue={filter.paydir}
                onValueChange={(e) => {
                    let filterData = { ...filter };
                    filterData.pg = 1;
                    filterData.agrigate = 1;
                    filterData.paydir = e;
                    setFilter(filterData);
                }}
            >
                {
                    selectionData.map((element, index) => {
                        return (
                            <Picker.Item key={element.value} color={theme.black} value={element.value} label={element.name} />
                        )
                    })
                }
            </Picker>
            <DocumentTimes
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            <View style={{
                width: '100%',
            }}>

                {documentsInfo != null ? (
                    <DocumentInfo
                        data={[
                            {
                                title: "Mədaxil",
                                value: formatPrice(documentsInfo.InSum)
                            },
                            {
                                title: "Məxaric",
                                value: formatPrice(documentsInfo.OutSum)
                            }
                        ]}
                    />
                ) : (
                    <View style={{
                        width: '100%',
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size={15} color={theme.primary} />
                        <Line width={'100%'} />
                    </View>
                )}


            </View>

            <>
                {
                    documents == null ?
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator size={30} color={theme.primary} />
                        </View>
                        :
                        <FlatList
                            data={documents}
                            keyExtractor={(item) => item.Id.toString()}
                            renderItem={({ item, index }) => (
                                <>
                                    <ListItem
                                        deactiveStatus={item.Status == 0}
                                        index={index + 1}
                                        onLongPress={() => {
                                            prompt('Ödənişi silməyə əminsiniz?', () => {
                                                handleDelete(item.Id, item);
                                            })
                                        }}
                                        markId={item.Mark}
                                        centerText={item.CustomerName}
                                        firstText={`${item.TypeName} - ${item.Moment}`}
                                        endText={item.SpendName != null && <Text style={{
                                            color: theme.button.disabled
                                        }}>{item.SpendName}</Text>}
                                        notIcon={true}
                                        priceText={formatPrice(item.Amount)}
                                        onPress={() => {
                                            if (permission_ver(permissions, 'page_payments', 'R')) {
                                                let obj = {
                                                    id: item.Id,
                                                    type: item.Type === "i" ? "invoice" : "payment",
                                                    direct: item.Direct === "i" ? "ins" : "outs"
                                                }
                                                navigation.navigate('payment-manage', obj)
                                            } else {
                                                ErrorMessage('İcazəniz yoxdur!')
                                            }
                                        }}
                                    />
                                </>
                            )}
                            ListFooterComponent={RenderFooter}
                            refreshing={isRefreshing}
                            onRefresh={() => {
                                setIsRefreshing(true);
                                if (selectedTime != null) {
                                    setSelectedTime(null);
                                    let filterData = { ...filter };
                                    delete filterData.momb;
                                    delete filterData.mome;
                                    filterData.agrigate = 1;
                                    setFilter(filterData);
                                    SuccessMessage("Yeniləndi")
                                }
                                setIsRefreshing(false)
                            }}
                            ListEmptyComponent={() => (
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 50
                                }}>
                                    {documents === null ? (
                                        <ActivityIndicator size={30} color={theme.primary} />
                                    ) : (
                                        <Text style={{ color: theme.text }}>List boşdur</Text>
                                    )}
                                </View>
                            )}
                        />
                }
            </>

            <FabButton
                onPress={() => {
                    if (permission_ver(permissions, 'page_payments', 'C')) {
                        setSelectionModal(true);
                    }
                }}
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={selectionModal}
                onRequestClose={() => {
                    setSelectionModal(!selectionModal);
                }}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    setSelectionModal(false)
                }} style={styles.centeredView}>
                    <TouchableOpacity onPress={() => {
                    }} activeOpacity={1} style={styles.modalView}>

                        <View
                            style={styles.modalHeader}>
                            <MaterialCommunityIcon name='file' color={theme.whiteGrey} size={25} />
                            <Text style={{
                                color: theme.whiteGrey
                            }}>Sənəd yaradın</Text>
                        </View>

                        <Pressable
                            onPress={() => {
                                handleDocumentCreate('ins');
                            }} style={styles.itemContainer}>
                            <AntDesign size={20} color={theme.primary} name='pluscircleo' />
                            <Text style={styles.itemText}>Mədaxil</Text>
                        </Pressable>

                        <Pressable onPress={() => {
                            handleDocumentCreate('outs');
                        }} style={styles.itemContainer}>
                            <AntDesign size={20} color={theme.primary} name='minuscircleo' />
                            <Text style={styles.itemText}>Məxaric</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                            handleDocumentCreate('outs', true);
                        }} style={styles.itemContainer}>
                            <AntDesign size={20} color={theme.primary} name='minuscircleo' />
                            <Text style={styles.itemText}>Xərc</Text>
                        </Pressable>

                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default PaymentList
