import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyModal from './../MyModal';
import SearchHeader from './../SearchHeader';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import { ActivityIndicator, Pressable } from '@react-native-material/core';

const GroupsModal = ({
    modalVisible,
    setModalVisible,
    setProduct
}) => {

    const theme = useTheme();

    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState(null)

    const fetchingGroups = async () => {
        await api('productfolders/get.php', {
            token: await AsyncStorage.getItem('token'),
            lm: 40
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setGroups([...element.List]);
                } else {
                    setGroups(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }
    

    const fetchingFastGroups = async () => {
        await api("productfolders/get.php", {
            nm: search,
            token: await AsyncStorage.getItem("token")
        }).then(async element => {
            if (element != null) {
                if (element.List[0]) {
                    setGroups([...element.List]);
                } else {
                    setGroups(null);
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                <Pressable onPress={() => {
                    setProduct(rel => ({ ...rel, ['GroupName']: item.Name }))
                    setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
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
        if (modalVisible && groups != null && !groups[0]) {
            fetchingGroups();
        }

        if (!modalVisible) {
            setSearch(null)
            setGroups([])
        }
    }, [modalVisible])

    useEffect(() => {
        let time;
        if (search != null) {
            setGroups([])
            if (search != "") {
                time = setTimeout(() => {
                    fetchingFastGroups();
                }, 400);
            } else {
                fetchingGroups();
            }
        }

        return () => clearTimeout(time);
    }, [search])

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
            height={"100%"}
        >
            <SearchHeader
                placeholder={'Qrup axtarışı...'}
                value={search}
                onChange={(e) => {
                    setSearch(e)
                }}
                onPress={() => {
                    setModalVisible(false)
                }}
            />

            {
                groups == null ?
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
                            groups[0] ?
                                <FlatList
                                    data={groups}
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
    )
}

export default GroupsModal

const styles = StyleSheet.create({})