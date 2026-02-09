import React, { useEffect, useState } from 'react';
import { SpinLoading } from 'antd-mobile';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../services/formatPrice';
import CustomersModal from '../../shared/ui/modals/CustomersModal';
import CardItem from '../../shared/ui/list/CardItem';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';

const Comprehensive = () => {
    const [info, setInfo] = useState(null);
    const [filter, setFilter] = useState({
        dr: 1,
        sr: "Moment",
        pg: 1,
        lm: 100,
    });
    const [customer, setCustomer] = useState({
        CustomerId: "",
        CustomerName: ""
    });
    let [data, setData] = useState([]);
    const [selectedTime, setSelectedTime] = useState(4);

    let fetchingData = async () => {
        setInfo(null);

        let obj = {
            ...filter,
            token: await AsyncStorageWrapper.getItem('token')
        };

        if (customer.CustomerId !== '') {
            obj.customerids = [customer.CustomerId];
        }

        await api('comprehensive/get.php', obj)
            .then((item) => {
                if (item != null) {
                    let list = [
                        {
                            title: 'ANBAR QALIĞI',
                            items: [
                                { key: 'İlkin maya', value: formatPrice(item.Stocks.FirstCost) },
                                { key: 'Son maya', value: formatPrice(item.Stocks.LastCost) },
                                { key: 'İlkin Miqdar', value: item.Stocks.FirstQuantity },
                                { key: 'Son Miqdar', value: item.Stocks.LastQuantity },
                                { key: 'İlkin Çeşid', value: item.Stocks.FirstPositions },
                                { key: 'Son Çeşid', value: item.Stocks.LastPositions },
                            ]
                        },
                        {
                            title: 'Satışlar',
                            items: [
                                { key: 'Məbləğ', value: formatPrice(item.Sales.Price) },
                                { key: 'Maya', value: formatPrice(item.Sales.Cost) },
                                { key: 'Qazanc', value: formatPrice(item.Sales.Profit) },
                                { key: 'Çeşid', value: item.Sales.Positions },
                                { key: 'Miqdar', value: item.Sales.Quantity },
                                { key: 'Marja', value: `${item.Sales.Margin}%` },
                                { key: 'Əlavə', value: `${item.Sales.Markup}%` },
                            ]
                        },
                        {
                            title: 'Qaytarmalar',
                            items: [
                                { key: 'Məbləğ', value: formatPrice(item.Returns.Price) },
                                { key: 'Maya', value: formatPrice(item.Returns.Cost) },
                                { key: 'Qazanc', value: formatPrice(item.Returns.Profit) },
                                { key: 'Çeşid', value: item.Returns.Positions },
                                { key: 'Miqdar', value: item.Returns.Quantity },
                            ]
                        },
                        {
                            title: 'Alış',
                            items: [
                                { key: 'Məbləğ', value: formatPrice(item.Supplies.Price) },
                                { key: 'Çeşid', value: item.Supplies.Positions },
                                { key: 'Miqdar', value: item.Supplies.Quantity },
                            ]
                        },
                        {
                            title: 'Ödənişlər',
                            items: [
                                { key: 'Mədaxil', value: formatPrice(item.Incomes.Amount) },
                                { key: 'Məxaric', value: formatPrice(item.Outcomes.Amount) }
                            ]
                        },
                        {
                            title: 'Qalıq borc',
                            items: [
                                { key: 'İlk borc', value: formatPrice(item.Settlements.firstAmount) },
                                { key: 'Son borc', value: formatPrice(item.Settlements.endAmount) }
                            ]
                        }
                    ];
                    setData(list);
                    setInfo({ ...item });
                } else {
                    setInfo("not");
                }
            })
            .catch(err => {
                ErrorMessage(err);
            });
    };

    useEffect(() => {
        fetchingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    useEffect(() => {
        let time = setTimeout(() => {
            fetchingData();
        }, 300);

        return () => clearTimeout(time);
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
                header={'Təchizatçı hesabatı'}
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'docNumber'}
            />
            <div style={{
                flex: 1,
                padding: 10,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
            }}>

                <CustomersModal
                    width={'100%'}
                    document={customer}
                    setDocument={setCustomer}
                    isDisable={false}
                    isName={true}
                />

                <DocumentTimes
                    filter={filter}
                    setFilter={setFilter}
                    selected={selectedTime}
                    setSelected={setSelectedTime}
                />

                {info == null ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <SpinLoading color='primary' style={{ '--size': '40px' }} />
                    </div>
                ) : info == 'not' ? (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <span style={{ textAlign: 'center', color: 'var(--adm-color-primary)', fontWeight: 'bold' }}>Məlumat tapılmadı!</span>
                    </div>
                ) : (
                    <div>
                        {data.map((section, index) => (
                            <div key={index} style={{ marginBottom: 10 }}>
                                <CardItem
                                    items={section.items}
                                    title={section.title}
                                    valueFormatPrice={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comprehensive;
