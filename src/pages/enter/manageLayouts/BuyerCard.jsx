import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import useTheme from '../../../shared/theme/useTheme'
import Selection from './../../../shared/ui/Selection';
import { EnterGlobalContext } from '../../../shared/data/EnterGlobalState'

const BuyerCard = ({ changeSelection }) => {

    const { document, setDocument } = useContext(EnterGlobalContext)
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
                        isRequired={true}
                        apiBody={{}}
                        apiName={'stocks/get.php'}
                        change={(e) => {
                            changeSelection('StockId', e.Id)
                        }}
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
