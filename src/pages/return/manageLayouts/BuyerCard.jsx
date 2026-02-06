import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import useTheme from '../../../shared/theme/useTheme'
import { formatPrice } from '../../../services/formatPrice'
import Selection from './../../../shared/ui/Selection';

const BuyerCard = ({ document }) => {

    const theme = useTheme();

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            padding: 15,
            gap: 10,
            flexDirection: 'row'
        }
    })

    return (
        <>
            <ManageCard>
                <View style={styles.header}>
                    <Ionicons size={20} color={theme.grey} name='person' />
                    <Text style={{
                        color: theme.grey
                    }}>Qarşı-Tərəf</Text>
                </View>

                <View style={{
                    gap: 15,
                    alignItems: 'center'

                }}>

                    <Selection
                        disabled={true}
                        isRequired={true}
                        apiBody={{}}
                        apiName={'customers/getfast.php'}
                        searchApi={'customers/getfast.php'}
                        change={() => { }}
                        searchKey={'fast'}
                        title={'Qarşı-Tərəf'}
                        value={document.CustomerId}
                        defaultValue={document.CustomerName}
                        bottomTitle={'Qarşı-tərəf'}
                    />

                    <Selection
                        disabled={true}
                        isRequired={true}
                        apiBody={{}}
                        apiName={'stocks/get.php'}
                        change={() => { }}
                        title={"Anbar"}
                        value={document.StockId}
                        defaultValue={document.StockName}
                    />

                </View>
            </ManageCard >
        </>
    )
}

export default BuyerCard
