import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../../shared/theme/useTheme'
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import getDateByIndex from '../../services/report/getDateByIndex';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import DocumentInfo from '../../shared/ui/DocumentInfo';

const CreditTransactionManage = ({ route, navigation }) => {

    let { id } = route.params;

    let theme = useTheme();

    const [filter, setFilter] = useState({
        lm: 100,
        pg: 0,
        ...getDateByIndex(4)
    })

    const [list, setList] = useState([]);
    const [sum, setSum] = useState(null);
    const [dateByIndex, setDateByIndex] = useState(4)

    const makeApiRequest = async () => {
        let obj = {
            ...filter,
            cus: id,
            token: await AsyncStorage.getItem('token')
        }

        await api('documents/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (filter.agrigate == 1) {
                        setSum(element);
                    }
                    setList(element.List);
                }
            })
            .catch(err => {
                ErrorMessage(err);
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


            <DocumentTimes
                filter={filter}
                setFilter={setFilter}
                selected={dateByIndex}
                setSelected={setDateByIndex}
            />
            
            {
                sum == null ?
                    <View style={{
                        width: '100%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size={30} color={theme.primary} />
                    </View>
                    :
                   <>
                    <DocumentInfo
                        data={[
                            {
                                title: "İlkin borc",
                                value: sum.InSum
                            },
                            {
                                title: "Alınıb",
                                value: Math.abs(sum.Debits)
                            },
                            {
                                title:"Verilib",
                                value:sum.Credits
                            },
                            {
                                title:'Yekun borc',
                                value:sum.AllSum
                            }
                        ]}
                    />
                   </>
            }

            <FlatList
                data={list}
                renderItem={({ item, index }) => {
                    return (
                        <ListItem
                            onPress={() => {
                                navigation.navigate('credit-transaction-manage', {
                                    id: item.Id
                                })
                            }}
                            centerText={item.CustomerName}
                            endText={item.Moment}
                            firstText={<Text style={{
                                color: theme.primary
                            }}>{item.SalePoint}</Text>}
                            notIcon={true}
                            index={index + 1}
                        />
                    );
                }}
            />
        </View>
    )
}

export default CreditTransactionManage

const styles = StyleSheet.create({})