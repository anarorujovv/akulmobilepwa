import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import getDateByIndex from '../../services/report/getDateByIndex';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import useTheme from '../../shared/theme/useTheme';
import { useNavigate } from 'react-router-dom';

const CashInList = () => {
    const navigate = useNavigate();
    let theme = useTheme();

    const [filter, setFilter] = useState({
        dr: 1,
        lm: 100,
        pg: 0,
        sr: 'Moment',
        ...getDateByIndex(4)
    });

    const [dateByIndex, setDateByIndex] = useState(4);
    const [list, setList] = useState([]);
    const [sum, setSum] = useState(null);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg
        },
        listContainer: {
            flex: 1,
            overflowY: 'auto'
        },
        emptyContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50
        }
    };

    const makeApiRequestCashInList = async () => {
        let obj = {
            ...filter,
            token: await AsyncStorageWrapper.getItem('token')
        };

        await api('cashins/get.php', obj)
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
            });
    };

    useEffect(() => {
        setList([]);
        let time = setTimeout(() => {
            makeApiRequestCashInList();
        }, 300);

        return () => clearTimeout(time);
    }, [filter]);

    return (
        <div style={styles.container}>
            <ListPagesHeader
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                header={'Kassa Mədaxil'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
                            // setFilter: setFilter, // Function cannot be passed via state in a reliable way for back navigation patterns often used here
                            // In a real refactor, Filter should probably accept a callback or return data
                            // For now, assuming Filter page logic stays similar, we might need a workaround or context.
                            // But proceeding with state for now.
                            searchParams: [
                                'salePoint',
                                'departments',
                                'owners',
                            ],
                            sortList: [
                                {
                                    id: 1,
                                    label: 'Satış nöqtəsi',
                                    value: 'SalePointName'
                                },
                                {
                                    id: 2,
                                    label: "Tarix",
                                    value: 'Moment'
                                },
                                {
                                    id: 3,
                                    label: "Məbləğ",
                                    value: 'Amount'
                                }
                            ],
                            customFields: {
                                departments: {
                                    title: "Şöbə",
                                    api: 'departments',
                                    name: "departmentName",
                                    type: 'select',
                                },
                            }
                        }
                    });
                }}
            />

            <DocumentTimes
                selected={dateByIndex}
                setSelected={setDateByIndex}
                filter={filter}
                setFilter={setFilter}
            />

            <div style={styles.listContainer}>
                {list === null || list.length === 0 ? (
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
                                firstText={item.SalePointName}
                                centerText={item.Moment}
                                priceText={formatPrice(item.Amount)}
                                index={index + 1}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CashInList;