import React, { useCallback, useEffect, useState } from 'react';
import { SpinLoading } from 'antd-mobile';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import getDateByIndex from '../../services/report/getDateByIndex';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import DocumentInfo from '../../shared/ui/DocumentInfo';

const CashInList = () => {

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--adm-color-background)',
            overflow: 'hidden'
        }}>
            <ListPagesHeader
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                header={'Kassa Mədaxil'}
                isSearch={true}
                isFilter={true}
                filterParams={{
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
                }}
            />

            <DocumentTimes
                selected={dateByIndex}
                setSelected={setDateByIndex}
                filter={filter}
                setFilter={setFilter}
            />

            {
                sum == null ?
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '10px 0',
                        borderBottom: '1px solid var(--adm-color-border)'
                    }}>
                        <SpinLoading color='primary' style={{ '--size': '20px' }} />
                    </div>
                    :
                    <DocumentInfo
                        data={[
                            {
                                title: "Məbləğ",
                                value: formatPrice(sum.AllSum)
                            }
                        ]}
                    />
            }

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 12px 0 12px'
            }}>
                {list === null || list.length === 0 ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        {list === null ? (
                            <SpinLoading color='primary' style={{ '--size': '40px' }} />
                        ) : (
                            <span style={{ color: 'var(--adm-color-weak)' }}>List boşdur</span>
                        )}
                    </div>
                ) : (
                    list.map((item, index) => (
                        <div key={index}>
                            <ListItem
                                firstText={item.SalePointName}
                                centerText={item.Moment}
                                priceText={formatPrice(item.Amount)}
                                notIcon={true}
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