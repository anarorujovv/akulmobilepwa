import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ManageCard from './ManageCard'
import useTheme from '../theme/useTheme'
import Entypo from 'react-native-vector-icons/Entypo'
import Input from './Input'
import Selection from './Selection'

const DestinationCard = ({ changeInput, changeSelection, document, setDocument, isAllDisabled }) => {

    const theme = useTheme();

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            padding: 15,
            gap: 10,
            flexDirection: 'row',
            alignItems: 'center'
        }
    })

    return (
        <>
            <ManageCard>
                <View style={styles.header}>
                    <Entypo size={23} color={theme.grey} name='info-with-circle' />
                    <Text style={{
                        color: theme.grey
                    }}>Təyinat</Text>
                </View>

                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Selection
                        disabled={isAllDisabled}
                        apiName={'owners/get.php'}
                        apiBody={{}}
                        change={(e) => {
                            changeInput('OwnerId', e.Id);
                        }}
                        value={document.OwnerId}
                        title={'Cavabdeh'}
                    />
                    <View style={{ marginTop: 10 }} />
                    <Selection
                        disabled={isAllDisabled}
                        apiName={'departments/get.php'}
                        apiBody={{}}
                        change={(e) => {
                            changeInput('DepartmentId', e.Id)
                        }}
                        value={document.DepartmentId}
                        title={'Şöbə'}
                    />
                    {
                        document.Description != null &&
                        <>
                            <View style={{ marginTop: 10 }} />
                            <Input
                                value={document.Description}
                                disabled={isAllDisabled}
                                isRequired={false}
                                onChange={(e) => {
                                    changeInput('Description', e);
                                }}
                                placeholder={'Açıqlama'}
                                type={'stirng'}
                                width={'70%'}
                            />
                        </>
                    }
                </View>

            </ManageCard>
        </>
    )
}

export default DestinationCard

