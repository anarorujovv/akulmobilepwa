import { ActivityIndicator, BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ManageCard from '../../shared/ui/ManageCard';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import moment from 'moment';
import Input from '../../shared/ui/Input';
import { formatPrice } from '../../services/formatPrice';
import Button from '../../shared/ui/Button';
import { formatObjectKey } from '../../services/formatObjectKey';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import prompt from '../../services/prompt';
import { useFocusEffect } from '@react-navigation/native';
import Selection from '../../shared/ui/Selection';
import SelectionDate from '../../shared/ui/SelectionDate';
import DestinationCard from '../../shared/ui/DestinationCard';
import playSound from '../../services/playSound';

const CashTransactionManage = ({ route, navigation }) => {

    let theme = useTheme();

    let { id } = route.params;

    const [c_transaction, set_c_transaction] = useState(null);
    const [dateModal, setDateModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const fetchingData = async (id) => {
        if (id != null) {
            await api('cashtransactions/get.php', {
                id: id,
                token: await AsyncStorage.getItem('token')
            })
                .then(element => {
                    if (element != null) {
                        let data = { ...element.List[0] };
                        data.Amount = formatPrice(data.Amount)
                        set_c_transaction(data);
                    }
                })
                .catch(err => {
                    ErrorMessage(err)
                })
        } else {

            let obj = {
                Status: true,
                Moment: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                Name: "",
                Amount: "",
                CashFromId: "",
                CashFromName: "",
                CashToId: "",
                CashToName: "",
                OwnerId: await AsyncStorage.getItem("ownerId") == null ? "" : await AsyncStorage.getItem('ownerId'),
                DepartmentId: await AsyncStorage.getItem("depId") == null ? "" : await AsyncStorage.getItem('depId'),
                Description: ""
            }

            await api('cashtransactions/newname.php', {
                n: "",
                token: await AsyncStorage.getItem('token')
            })
                .then(element => {
                    if (element != null) {
                        obj.Name = element.ResponseService
                    }
                })
                .catch(err => {
                    ErrorMessage(err);
                })

            set_c_transaction(obj)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        let data = { ...c_transaction };
        let info = { ...formatObjectKey(data) };
        info.token = await AsyncStorage.getItem('token')

        await api('cashtransactions/put.php', info)
            .then(item => {
                if (item != null) {
                    fetchingData(item.ResponseService);
                    SuccessMessage('Yadda Saxlanıldı!');
                    setHasUnsavedChanges(false);
                    playSound('success')
                }
            })
            .catch(err => {
                ErrorMessage(err);
            })

        setIsLoading(false);
    }

    const hasUnsavedChangesFunction = () => {
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    }

    const handleChangeInput = (key, value) => {
        set_c_transaction(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    const handleChangeSelection = (key, value) => {
        set_c_transaction(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    useFocusEffect(

        useCallback(() => {
            const onBackPress = async () => {
                navigation.setParams({ shouldGoToSpecificPage: false });
                hasUnsavedChanges ? prompt('Çıxmağa əminsiniz ?', () => navigation.goBack()) : (navigation.goBack());
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [hasUnsavedChanges]))

    useEffect(() => {
        fetchingData(id);
    }, [id])

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.whiteGrey
        }}>
            {
                c_transaction == null ?
                    <View style={{
                        flex: 1,
                    }}>
                        <ActivityIndicator size={30} color={theme.primary} />
                    </View>
                    :

                    <View style={{
                        flex: 1,
                        justifyContent: 'space-between'
                    }}>
                        <ManageCard>
                            <View style={{
                                width: '100%',
                                padding: 15,
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    color: theme.primary
                                }}>Transfer</Text>
                            </View>

                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                                gap: 20
                            }}>
                                <Input
                                    value={c_transaction.Name}
                                    onChange={(e) => {
                                        handleChangeInput('Name', e)
                                    }}
                                    placeholder={'Ad'}
                                    type={'string'}
                                    width={'70%'}
                                />

                                <SelectionDate
                                    document={c_transaction}
                                    setDocument={set_c_transaction}
                                    change={handleChangeSelection}
                                    modalVisible={dateModal}
                                    setModalVisible={setDateModal}
                                />

                                <Input
                                    value={c_transaction.Amount}
                                    width={'70%'}
                                    type={'number'}
                                    placeholder={'Məbləğ'}
                                    onChange={(e) => {
                                        handleChangeInput('Amount', e)
                                    }}
                                />

                                <Selection
                                    isRequired={true}
                                    apiBody={{}}
                                    apiName={'cashes/get.php'}
                                    change={(e) => {
                                        handleChangeInput('CashFromId', e.Id);
                                    }}
                                    defaultValue={c_transaction.CashFromName}
                                    title={'Hesabdan'}
                                    value={c_transaction.CashFromId}
                                />

                                <Selection
                                    isRequired={true}
                                    apiBody={{}}
                                    apiName={'cashes/get.php'}
                                    change={(e) => {
                                        handleChangeInput('CashToId', e.Id);
                                    }}
                                    defaultValue={c_transaction.CashToName}
                                    title={'Hesaba'}
                                    value={c_transaction.CashToId}
                                />


                            </View>


                        </ManageCard>

                        <DestinationCard
                            changeInput={handleChangeInput}
                            changeSelection={handleChangeSelection}
                            document={c_transaction}
                            setDocument={set_c_transaction}
                        />
                        {
                            hasUnsavedChanges ?
                                <Button
                                    onClick={handleSave}
                                    isLoading={isLoading}
                                    bg={theme.green}
                                    disabled={isLoading}
                                >
                                    Yadda Saxla
                                </Button>
                                :
                                ""
                        }
                    </View>
            }


        </View>
    )
}

export default CashTransactionManage

const styles = StyleSheet.create({})