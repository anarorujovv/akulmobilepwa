import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import ManageHeader from '../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import BuyerCard from './manageLayouts/BuyerCard';
import ProductCard from './manageLayouts/ProductCard';
import DestinationCard from '../../shared/ui/DestinationCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';

const SaleManage = ({ route, navigation }) => {

    let theme = useTheme();
    let { id } = route.params;

    const [document, setDocument] = useState(null);

    const makeApiRequest = async () => {
        let obj = {
            id: id,
            token: await AsyncStorage.getItem("token")
        }
        
        await api('sales/get.php', obj)
            .then(element => {
                if (element != null) {
                    setDocument(element.List[0]);
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    useEffect(() => {
        makeApiRequest();
    }, [id])

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.bg
        }}>

            <ManageHeader
                document={document}
                navigation={navigation}
                hasUnsavedChanges={false}
            />

            {
                document == null
                    ?
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size={30} color={theme.primary} />
                    </View>
                    :
                    <ScrollView style={{
                        flex: 1,
                    }}>
                        <MainCard document={document} />
                        <BuyerCard document={document} />
                        <ProductCard document={document} setDocument={setDocument} />
                        <DestinationCard isAllDisabled={true} changeInput={() => { }} changeSelection={() => { }} document={document} setDocument={() => { }} />
                    </ScrollView>
            }
        </View>
    )
}

export default SaleManage

const styles = StyleSheet.create({})