import React, { useState, useEffect } from 'react';
import { SpinLoading, Divider } from 'antd-mobile';
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
            <React.Fragment key={item.Id}>
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
            </React.Fragment>
        )
    }

    useEffect(() => {
        makeApiRequest();
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
                header={'Qaytarmalar'}
                isSearch={true}
                filterSearchKey={'docNumber'}
                isFilter={true}
                filterParams={{
                    searchParams: [
                        'documentName',
                        'product',
                        'stocks',
                        'salePoint',
                        'customers',
                    ],
                    sortList: [
                        { id: 1, label: 'Ad', value: 'Name' },
                        { id: 2, label: 'Satış nöqtəsi', value: 'SalePointName' },
                        { id: 3, label: 'Tarix', value: 'Moment' },
                        { id: 4, label: "Tərəf-Müqabil", value: 'customers' },
                        { id: 5, label: 'Nağd', value: 'Amount' },
                        { id: 6, label: 'Nağdsız', value: 'Bank' }
                    ]
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
                                value: formatPrice(returnsSum.AllSum),
                                title: "Nağd"
                            }
                        ]}
                    />
            }

            <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: 80,
                padding: '0 12px 80px 12px'
            }}>
                {returns === null || returns.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: 'var(--adm-color-weak)'
                    }}>
                        {returns === null ? (
                            <SpinLoading color='primary' style={{ '--size': '40px' }} />
                        ) : (
                            <span>List boşdur</span>
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