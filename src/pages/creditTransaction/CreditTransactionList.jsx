import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import getDateByIndex from '../../services/report/getDateByIndex';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { useNavigate } from 'react-router-dom';

const CreditTransactionList = () => {
    const navigate = useNavigate();
    let theme = useTheme();

    const [filter, setFilter] = useState({
        dr: 1,
        lm: 100,
        pg: 0,
        sr: 'Moment',
        ...getDateByIndex(4)
    })

    const [list, setList] = useState([]);
    const [sum, setSum] = useState(null);
    const [dateByIndex, setDateByIndex] = useState(4)

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        listContainer: {
            flex: 1,
            overflowY: 'auto'
        },
        loadingContainer: {
            width: '100%',
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        emptyContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50
        }
    };

    const makeApiRequest = async () => {
        let obj = {
            ...filter,
            token: await AsyncStorageWrapper.getItem('token')
        }
        await api('credittransactions/get.php', obj)
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
    }, [filter])

    return (
        <div style={styles.container}>
            <ListPagesHeader
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'docNumber'}
                header={'Ödənişlər'}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
                            // setFilter:setFilter,
                            searchParams: [
                                'documentName',
                                'spendItems',
                                'customers',
                            ],
                            sortList: [
                                {
                                    id: 1,
                                    label: 'Satış nöqtəsi',
                                    value: 'SalePoint'
                                },
                                {
                                    id: 2,
                                    label: 'Tarix',
                                    value: 'Moment'
                                },
                                {
                                    id: 3,
                                    label: 'Tərəf-Müqabil',
                                    value: 'CustomerName'
                                },
                            ]
                        }
                    })
                }}
            />
            <DocumentTimes
                filter={filter}
                setFilter={setFilter}
                selected={dateByIndex}
                setSelected={setDateByIndex}
            />

            {
                sum == null ?
                    <div style={styles.loadingContainer}>
                        <div className="spinner" style={{ width: 20, height: 20 }}></div>
                    </div>
                    :
                    <DocumentInfo
                        data={[
                            {
                                title: "Mədaxil",
                                value: sum.InSum
                            },
                            {
                                title: "Məxaric",
                                value: sum.OutSum
                            }
                        ]}
                    />
            }

            <div style={styles.listContainer}>
                {list == null || list.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        {list === null ? (
                            <div className="spinner"></div>
                        ) : (
                            <span style={{ color: theme.text }}>List boşdur</span>
                        )}
                    </div>
                ) : (
                    list.map((item, index) => (
                        <div key={index}>
                            <ListItem
                                centerText={item.CustomerName}
                                endText={item.Moment}
                                firstText={<span style={{
                                    color: theme.primary
                                }}>{item.SalePoint}</span>}
                                notIcon={true}
                                index={index + 1}
                                onPress={() => {
                                    // Assuming navigate to manage page, possibly customer manage or credit manage
                                    // Original code didn't have onPress logic in rendered Item but did on flatlist?
                                    // Wait, original code:
                                    // renderItem={({ item, index }) => { return ( <ListItem ... onPress={() => { navigation.navigate('credit-transaction-manage', { id: item.Id }) }} ... /> ) }}
                                    // Ah, wait, in CreditTransactionManage.jsx listing it has onPress.
                                    // In CreditTransactionList.jsx it has ListItem but NO onPress in original code snippet I saw?
                                    // Let me re-read step 1182.
                                    // In step 1182:
                                    // renderItem={({ item, index }) => {
                                    //     return (
                                    //         <ListItem
                                    //             centerText={item.CustomerName}
                                    //             ...
                                    //             notIcon={true}
                                    //             index={index + 1}
                                    //             // No onPress here in List.jsx
                                    //         />
                                    //     );
                                    // }}
                                    // But wait, usually a list item is clickable.
                                    // Let's check CreditTransactionManage.jsx (step 1183).
                                    // In Manage.jsx, it lists items and has onPress to navigate to 'credit-transaction-manage'.
                                    // That seems recursive or maybe details.
                                    // In List.jsx, it seems to list aggregated or main transactions.
                                    // I will add onPress if appropriate or leave as is if it was read-only overview.
                                    // The original List.jsx didn't seem to have onPress. 
                                    // Wait, CreditTransactionList.jsx in step 1182 lines 128-140. NO onPress.
                                    // Okay, I will respect original code and not add onPress unless it was there.
                                }}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default CreditTransactionList;