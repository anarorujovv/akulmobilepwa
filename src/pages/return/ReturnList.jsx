import React, { useCallback, useState, useEffect } from 'react';
import useTheme from '../../shared/theme/useTheme';
import getDateByIndex from '../../services/report/getDateByIndex';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { useNavigate } from 'react-router-dom';

const ReturnsList = () => {
    const navigate = useNavigate();
    let theme = useTheme();
    let [filter, setFilter] = useState({
        dr: 1,
        lm: 100,
        pg: 0,
        sr: 'Moment',
        ...getDateByIndex(4)
    })

    const [returns, setReturns] = useState([]);
    const [returnsSum, setReturnsSum] = useState(null);
    const [selectedTime, setSelectedTime] = useState(4)

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
            overflowY: 'auto',
            paddingBottom: 80
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
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            paddingTop: 50
        }
    };

    const makeApiRequest = async () => {
        let obj = {
            ...filter,
            token: await AsyncStorageWrapper.getItem('token')
        }

        await api('returns/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (filter.agrigate == 1) {
                        setReturnsSum(element);
                    }
                    setReturns(element.List);
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    const renderItem = (item, index) => {
        return (
            <div key={item.Id}>
                <ListItem
                    centerText={item.CustomerName}
                    firstText={item.SalePointName}
                    endText={item.Moment}
                    notIcon={true}
                    index={index + 1}
                    priceText={formatPrice(item.Amount)}
                    onPress={() => {
                        navigate('/return/return-manage', {
                            state: { id: item.Id }
                        })
                    }}
                />
            </div>
        )
    }

    useEffect(() => {
        makeApiRequest();
    }, [filter]);

    return (
        <div style={styles.container}>
            <ListPagesHeader
                filter={filter}
                setFilter={setFilter}
                header={'Qaytarmalar'}
                isSearch={true}
                filterSearchKey={'docNumber'}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
                            // setFilter:setFilter,
                            searchParams: [
                                'documentName',
                                'product',
                                'stocks',
                                'salePoint',
                                'customers',
                            ],
                            sortList: [
                                {
                                    id: 1,
                                    label: 'Ad',
                                    value: 'Name'
                                },
                                {
                                    id: 2,
                                    label: 'Satış nöqtəsi',
                                    value: 'SalePointName'
                                },
                                {
                                    id: 3,
                                    label: 'Tarix',
                                    value: 'Moment'
                                },
                                {
                                    id: 4,
                                    label: "Tərəf-Müqabil",
                                    value: 'customers'
                                },
                                {
                                    id: 5,
                                    label: 'Nağd',
                                    value: 'Amount'
                                },
                                {
                                    id: 6,
                                    label: 'Nağdsız',
                                    value: 'Bank'
                                }
                            ]
                        }
                    })
                }}
            />

            <DocumentTimes
                filter={filter}
                setFilter={setFilter}
                selected={selectedTime}
                setSelected={setSelectedTime}
            />

            {
                returnsSum == null ?
                    <div style={styles.loadingContainer}>
                        <div className="spinner" style={{ width: 20, height: 20 }}></div>
                    </div>
                    :
                    <DocumentInfo
                        data={[
                            {
                                value: formatPrice(returnsSum.AllSum),
                                title: "Nağd"
                            }
                        ]}
                    />
            }

            <div style={styles.listContainer}>
                {returns === null || returns.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        {returns === null ? (
                            <div className="spinner"></div>
                        ) : (
                            <span style={{ color: theme.text }}>List boşdur</span>
                        )}
                    </div>
                ) : (
                    returns.map((item, index) => renderItem(item, index))
                )}
            </div>
        </div>
    )
}

export default ReturnsList;