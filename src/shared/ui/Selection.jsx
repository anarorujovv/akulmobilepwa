import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './MyModal';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import useTheme from '../theme/useTheme';
import Line from './Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';
import Input from './Input';
import SearchHeader from './SearchHeader';

const Selection = ({
    value,
    apiName,
    title,
    defaultValue,
    apiBody,
    change,
    bottomTitle,
    bottomText,
    isRequired,
    searchApi,
    searchKey,
    disabled
}) => {

    const theme = useTheme();
    const [info, setInfo] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [search, setSearch] = useState('');

    const fetchingData = async () => {
        await api(apiName, {
            ...apiBody,
            token: await AsyncStorage.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    let list = [...element.List];
                    if (defaultValue) {
                        setSelectedValue(defaultValue);
                    } else {
                        let index = list.findIndex(rel => rel.Id == value);
                        if (index != -1) {
                            setSelectedValue(list[index].Name)
                        }
                    }
                    setInfo(list);
                } else {
                    setInfo(null)
                }
            } else {
                setInfo(null);
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    const fetchingFastData = async () => {

        let obj = {
            [searchKey]: search,
            lm: 100,
            token: await AsyncStorage.getItem('token')
        }


        await api(searchApi, obj).then((element) => {

            if (element != null) {

                if (element.List[0]) {
                    let list = [...element.List];
                    setInfo(list)
                } else {
                    setInfo(null);
                }
            } else {
                setInfo(null)
            }
        })
            .catch((err) => {
                ErrorMessage(err)
            })
    }

    const renderItem = ({ item }) => {
        return (
            <>
                <Pressable
                    disabled={disabled}
                    onPress={() => {
                        setSelectedValue(item.Name)
                        if (change) {
                            change(item);
                        }
                        setModalVisible(false);
                    }} pressEffectColor={theme.input.grey} style={{
                        width: '100%',
                        height: 55,
                        paddingLeft: 20,
                        justifyContent: 'center',
                    }}>
                    <Text style={{
                        color: theme.black,
                        fontSize: 13
                    }}>{item.Name}</Text>
                </Pressable>
                <Line width={'90%'} />
            </>
        )
    }

    useEffect(() => {
        if (searchApi == undefined) {
            fetchingData();
        }
    }, [])

    useEffect(() => {
        let time;
        if (search == '') {
            fetchingData();
        } else {
            if (info == null || info[0]) {
                setInfo([]);
            }
            time = setTimeout(() => {
                fetchingFastData();
            }, 400);
        }

        return () => clearTimeout(time);
    }, [search])

    return (
        <>
            {
                info == null ?
                    defaultValue != undefined ?
                        <Pressable
                            disabled={disabled}
                            style={{
                                width: "100%",
                                alignItems: "center"
                            }}
                        >
                            <Input
                                isRequired={isRequired}
                                width={'70%'}
                                disabled={true}
                                value={defaultValue}
                                placeholder={title}
                            />
                            {
                                bottomText != undefined ?

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            width: '70%',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, color: theme.orange }}>{bottomTitle}</Text>
                                        <Text style={{ fontSize: 12, color: bottomText >= 0 ? theme.black : theme.green }}>{bottomText} ₼</Text>
                                    </View>
                                    :
                                    ""
                            }
                        </Pressable>
                        :
                        <View style={{
                            width: '100%',
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                width: '70%',
                                height: 50,
                                borderBottomWidth: 1,
                                borderColor: theme.input.grey,
                                justifyContent: 'center',
                                alignItems: 'flex-start'
                            }}>
                                <Text style={{
                                    color: theme.black
                                }}>Anbar tapılmadı</Text>
                            </View>
                        </View>
                    :
                    info[0] ?
                        <Pressable
                            disabled={disabled}
                            style={{
                                width: "100%",
                                alignItems: "center"
                            }}
                            onPress={() => {
                                setModalVisible(true);
                            }}
                        >
                            <Input
                                isRequired={isRequired}
                                width={'70%'}
                                disabled={true}
                                value={selectedValue}
                                placeholder={title}
                            />
                            {
                                bottomText != undefined ?

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            width: '70%',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, color: theme.orange }}>{bottomTitle}</Text>
                                        <Text style={{ fontSize: 12, color: bottomText >= 0 ? theme.black : theme.green }}>{bottomText} ₼</Text>
                                    </View>
                                    :
                                    ""
                            }
                        </Pressable>
                        :
                        <View style={{
                            width: '100%',
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                width: '70%',
                                height: 50,
                                borderBottomWidth: 1,
                                borderColor: theme.input.grey,
                                justifyContent: 'center',
                                alignItems: 'flex-start'
                            }}>
                                <ActivityIndicator size={20} color={theme.primary} />
                            </View>
                        </View>

            }

            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
                height={"100%"}
            >
                {
                    searchApi != undefined &&
                    <SearchHeader
                        placeholder={'Axtarış...'}
                        value={search}
                        onChange={(e) => {
                            setSearch(e)
                        }}
                        onPress={() => {
                            setModalVisible(false)
                        }}
                    />
                }
                {

                    info == null ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 16,
                                color: theme.primary
                            }}>Məlumat tapılmadı...</Text>
                        </View>
                        :
                        <View style={{
                            width: '100%',
                            height: '100%'
                        }}>
                            {
                                info[0] ?
                                    <FlatList
                                        data={info}
                                        renderItem={renderItem}
                                    />
                                    :
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <ActivityIndicator size={40} color={theme.primary} />
                                    </View>
                            }

                        </View>
                }

            </MyModal>
        </>
    )
}

export default Selection

const styles = StyleSheet.create({})