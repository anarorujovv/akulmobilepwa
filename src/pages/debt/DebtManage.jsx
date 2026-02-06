import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import useTheme from '../../shared/theme/useTheme';
import Line from './../../shared/ui/Line';
import translateDebtTerm from './../../services/report/debtType';
import { formatPrice } from '../../services/formatPrice';
import ListItem from '../../shared/ui/list/ListItem';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import moment from 'moment';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import DocumentTimes from '../../shared/ui/DocumentTimes';

const DebtManage = ({ route, navigation }) => {

    let { id } = route.params;
    let theme = useTheme();

    const [document, setDocument] = useState(null);
    const [documentList, setDocumentList] = useState([]);

    let [filter, setFilter] = useState({
        cus: id,
    })

    const [selectedTime, setSelectedTime] = useState(4);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bg,             // Using theme background color
        },
        separator: {
            height: 1,
            backgroundColor: theme.whiteGrey,      // Using theme's whiteGrey for separator color
        },
        balanceSection: {
            alignItems: 'center',
            paddingVertical: 16,
        },
        balanceTitle: {
            fontSize: 14,
            color: theme.grey,                     // Using theme's grey color for muted text
            marginBottom: 1,
        },
        balanceValue: {
            fontSize: 18,
            fontWeight: '800',
            color: theme.black,                    // Using theme's black color for main text
        },
    });

    const fethingInformation = async () => {
        await api('documents/get.php', {
            ...filter,
            token: await AsyncStorage.getItem('token')
        }).then(async element => {
            let objData = { ...element }
            let initalDebt = formatPrice((objData.AllSum) - formatPrice(objData.Credits)) + formatPrice(Math.abs(objData.Debits))
            objData.initalDebt = String(initalDebt);
            setDocument(objData);
            setDocumentList(objData.List);
            console.log(objData);
        }).catch(err => {
            ErrorMessage(err);
        })
    }

    useEffect(() => {
        if (documentList[0]) {
            setDocument([]);
        }
        fethingInformation();
    }, [filter])

    return (
        document == null ?
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <ActivityIndicator size={40} color={theme.primary} />
            </View>
            :
            <View style={styles.container}>
                <Text style={{
                    color: theme.black,
                    fontSize: 15,
                    textAlign: 'center',
                    marginTop: 30,
                    fontWeight: 'bold'
                }}>{document.CustomerName}</Text>
                <Text style={{
                    textAlign: 'center',
                    color: theme.input.grey,
                }}>Üzləşmə aktı</Text>
                <View style={{ margin: 10 }} />
                <View style={styles.separator} />

                <DocumentInfo
                    data={[
                        {
                            title: "İlkin borc",
                            value: document.initalDebt
                        },
                        {
                            title: 'Alınıb',
                            value: formatPrice(document.Debits)
                        },
                        {
                            title: 'Verilib',
                            value: document.Credits
                        },
                        {
                            title: 'Yekun Borc',
                            value: formatPrice(document.AllSum)
                        }
                    ]}
                />

                <View style={styles.separator} />
                <Line width={'90%'} />
                <DateRangePicker
                    submit={true}
                    width={'100%'}
                    filter={filter}
                    setFilter={setFilter}
                />
                <View style={{ margin: 10 }} />
                <DocumentTimes
                    filter={filter}
                    setFilter={setFilter}
                    selected={selectedTime}
                    setSelected={setSelectedTime}
                />
                {
                    documentList[0] ?
                        <ScrollView>
                            {
                                documentList.map((item, index) => {
                                    return (
                                        <ListItem
                                            onPress={() => {
                                                // navigation.navigate(translateDebtTerm(item.DocType).route);
                                                navigation.navigate('demand-return-manage', {
                                                    id: item.LinkId
                                                })
                                            }}
                                            index={index + 1}
                                            iconBasket={true}
                                            firstText={translateDebtTerm(item.DocType).title}
                                            centerText={item.Moment}
                                            priceText={formatPrice(item.Amount)}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size={30} color={theme.primary} />
                        </View>
                }
            </View>
    )
}

export default DebtManage

