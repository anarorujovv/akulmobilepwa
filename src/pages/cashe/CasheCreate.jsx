import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ManageHeader from './../../shared/ui/ManageHeader';
import ManageCard from '../../shared/ui/ManageCard';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Input from '../../shared/ui/Input';
import api from '../../services/api';
import { formatObjectKey } from '../../services/formatObjectKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import SuccessMessage from '../../shared/ui/RepllyMessage/SuccessMessage';
import MySelection from './../../shared/ui/MySelection';
import Button from '../../shared/ui/Button';
import prompt from '../../services/prompt';
import { useFocusEffect } from '@react-navigation/native';
import DestinationCard from '../../shared/ui/DestinationCard';

const CasheCreate = ({ navigation }) => {
    let theme = useTheme()
    const [isLoading, setIsLoading] = useState(false);

    const [document, setDocument] = useState({
        Name: "",
        Description: "",
        CashType: "",
        DepartmentId: "",
        OwnerId: "",
    })

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg
        }
        ,
        header: {
            flexDirection: 'row',
            gap: 10,
            padding: 15,
            alignItems: 'center',
            width: '100%'
        }
    })

    const handleCreate = async () => {
        setIsLoading(true)
        let obj = { ...document };
        let json = formatObjectKey(obj)
        json.token = await AsyncStorage.getItem('token')
        await api('cashes/put.php', json).then(element => {
            if (element !== null) {
                SuccessMessage("Yadda Saxlanıldı")
                navigation.goBack();
            }
        }).catch(err => {
            ErrorMessage(err)
        })
        setIsLoading(false);
    }

    const hasUnsavedChangesFunction = () => {
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    }

    const handleChangeInput = (key, value) => {
        setDocument(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    const handleChangeSelection = (key, value) => {
        setDocument(rel => ({ ...rel, [key]: value }))
        hasUnsavedChangesFunction();
    }

    const fetchingData = async () => {
        let info = {
            ...document,
            OwnerId: await AsyncStorage.getItem("ownerId") == null ? "" : await AsyncStorage.getItem('ownerId'),
            DepartmentId: await AsyncStorage.getItem("depId") == null ? "" : await AsyncStorage.getItem('depId'),
            Description: ""
        }
        setDocument(info);
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
        fetchingData();
    }, [])

    return (
        <View style={styles.container}>

            <ManageHeader
                navigation={navigation}
                hasUnsavedChanges={hasUnsavedChanges}
            />

            <View style={{
                flex: 1,
                width: '100%',
                height: '100%',
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
                        }}>Hesablar</Text>
                    </View>

                    <View style={styles.header}>
                        <FontAwesome6 name='user-large' color={theme.grey} size={20} />
                        <Text style={{
                            color: theme.grey
                        }}>Hesab</Text>
                    </View>
                    <View style={{
                        gap: 10,
                        alignItems: 'center'
                    }}>
                        <Input
                            isRequired={true}
                            placeholder={'Name'}
                            value={document.Name}
                            type={'string'}
                            onChange={(e) => {
                                handleChangeInput('Name', e)
                            }}
                            width={'70%'}
                        />

                        <MySelection

                            value={document.CashType}
                            label={'Hesab'}
                            labelName={'label'}
                            valueName={'value'}
                            width={'70%'}
                            list={[
                                {
                                    label: "Nağd",
                                    value: "cash"
                                },
                                {
                                    label: "Nağdsız",
                                    value: "noncash"
                                }
                            ]}
                            onValueChange={(e) => {
                                handleChangeInput('CashType', e)
                            }}

                        />

                        {/* Şöbə üçün selection inputu */}

                    </View>
                </ManageCard>

                <DestinationCard
                    changeInput={handleChangeInput}
                    changeSelection={handleChangeSelection}
                    document={document}
                    setDocument={setDocument}
                />
                <Button
                    onClick={handleCreate}
                    bg={theme.green}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    Yadda Saxla
                </Button>
            </View>
        </View>
    )
}

export default CasheCreate
