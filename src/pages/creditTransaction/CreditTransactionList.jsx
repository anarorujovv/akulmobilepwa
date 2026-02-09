import React, { useEffect, useState } from 'react';
import { SpinLoading } from 'antd-mobile';
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

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
                isSearch={true}
                filterSearchKey={'docNumber'}
                header={'Ödənişlər'}
                isFilter={true}
                filterParams={{
                    searchParams: [
                        'documentName',
                        'spendItems',
                        'customers',
                    ],
                    sortList: [
                        { id: 1, label: 'Satış nöqtəsi', value: 'SalePoint' },
                        { id: 2, label: 'Tarix', value: 'Moment' },
                        { id: 3, label: 'Tərəf-Müqabil', value: 'CustomerName' },
                    ]
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
                    <div style={{
                        width: '100%',
                        height: 50,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--adm-color-border)'
                    }}>
                        <SpinLoading color='primary' style={{ '--size': '20px' }} />
                    </div>
                    :
                    <DocumentInfo
                        data={[
                            { title: "Mədaxil", value: sum.InSum },
                            { title: "Məxaric", value: sum.OutSum }
                        ]}
                    />
            }

            <div style={{
                flex: 1,
                overflowY: 'auto'
            }}>
                {list == null ? (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <SpinLoading color='primary' style={{ '--size': '40px' }} />
                    </div>
                ) : (
                    <>
                        {list.length === 0 ? (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 50,
                                color: 'var(--adm-color-weak)'
                            }}>
                                <span>List boşdur</span>
                            </div>
                        ) : (
                            list.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem
                                        centerText={item.CustomerName}
                                        endText={item.Moment}
                                        firstText={<span style={{
                                            color: 'var(--adm-color-primary)'
                                        }}>{item.SalePoint}</span>}
                                        notIcon={true}
                                        index={index + 1}
                                        onPress={() => {
                                            // No functionality provided in original code
                                        }}
                                    />
                                </React.Fragment>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default CreditTransactionList;