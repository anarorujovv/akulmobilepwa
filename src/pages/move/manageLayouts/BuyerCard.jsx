import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import useTheme from '../../../shared/theme/useTheme'
import Selection from './../../../shared/ui/Selection';
import mergeProductQuantities from '../../../services/mergeProductQuantities'
import { MoveGlobalContext } from '../../../shared/data/MoveGlobalState'

const BuyerCard = ({ changeSelection }) => {

    const { document, setDocument } = useContext(MoveGlobalContext)
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
                            changeSelection('StockFromId', e.Id)
                        }}
                        title={"Anbardan"}
                        value={document.StockFromId}
                        defaultValue={document.StockFromName}
                    />

                    <Selection
                        isRequired={true}
                        apiBody={{}}
                        apiName={'stocks/get.php'}
                        change={(e) => {
                            changeSelection('StockToId', e.Id)
                        }}
                        title={"Anbara"}
                        value={document.StockToId}
                        defaultValue={document.StockToName}
                    />

                </View>
            </ManageCard >
        </>
    )
}

export default BuyerCard
