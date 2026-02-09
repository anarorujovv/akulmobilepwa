import React, { useEffect, useState } from 'react';
import { AiOutlineShoppingCart, AiOutlineBank, AiOutlineWallet, AiOutlineAppstore } from 'react-icons/ai';
import { BsCashCoin } from 'react-icons/bs';
import { SpinLoading, Grid, Card } from 'antd-mobile';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../services/formatPrice';
import getDateByIndex from '../../services/report/getDateByIndex';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import Selection from '../../shared/ui/Selection';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import { useNavigate } from 'react-router-dom';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';

const ExpeditorList = () => {
    const navigate = useNavigate();

    const permissions = useGlobalStore(state => state.permissions);
    const [cashes, setCashes] = useState([]);
    const [demandSums, setDemandSums] = useState([]);
    const [paymentSums, setPaymentSums] = useState([]);
    const [debtSums, setDebtsSums] = useState([]);
    const [customerOrderAndMoveSums, setCustomerOrderAndMoves] = useState([]);
    const [dateFilter, setDateFilter] = useState({
        ...getDateByIndex(0)
    });
    const [selectedTime, setSelectedTime] = useState(0);
    const [owner, setOwner] = useState(null);

    const renderCard = (title, icon, items, style = {}) => (
        <Card style={{
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: 'none',
            ...style
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
                gap: 8
            }}>
                {icon}
                <span style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: 'var(--adm-color-text)'
                }}>{title}</span>
            </div>
            <div style={{ marginTop: 8 }}>
                {items != null ? (
                    items[0] ? (
                        items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    if (item.navParams == undefined) {
                                        navigate(item.navName);
                                    } else {
                                        navigate(item.navName, { state: { ...item.navParams } });
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 10,
                                    cursor: 'pointer',
                                    padding: '4px 0',
                                    borderBottom: index !== items.length - 1 ? '1px solid var(--adm-color-border)' : 'none'
                                }}
                            >
                                <span style={{
                                    fontSize: 14,
                                    color: 'var(--adm-color-primary)',
                                    textDecoration: "underline"
                                }}>{item.key}</span>
                                <span style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: 'var(--adm-color-text)'
                                }}>{item.value}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10
                        }}>
                            <SpinLoading color='primary' style={{ '--size': '20px' }} />
                        </div>
                    )
                ) : (
                    ""
                )}
            </div>
        </Card>
    );

    async function fetchingCashes() {
        let obj = {
            token: await AsyncStorageWrapper.getItem('token'),
            dr: 0,
            lm: 100,
            pg: 0,
            ownerName: owner
        };
        await api('cashes/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (element.List[0]) {
                        setCashes(element.List);
                    } else {
                        setCashes(null);
                    }
                }
            })
            .catch(err => {
                ErrorMessage(err);
            });
    }

    async function fetchingDemandAmounts() {
        let obj = {
            dr: 0,
            lm: 100,
            pg: 0,
            ownerName: owner,
            token: await AsyncStorageWrapper.getItem('token'),
            ...dateFilter
        };

        let arr = [];

        let demand = await api('demands/get.php', obj);
        let demandReturn = await api('demandreturns/get.php', obj);

        if (demand != null) {
            arr.push({
                key: 'Satış',
                value: formatPrice(demand.AllSum),
                navName: "/demands/demand"
            });
        } else {
            arr.push({
                key: 'Satış',
                value: 0,
                navName: "/demands/demand"
            });
        }

        if (demandReturn != null) {
            arr.push({
                key: 'İadə',
                value: formatPrice(demandReturn.AllSum),
                navName: '/demands/demandreturns'
            });
        } else {
            arr.push({
                key: 'İadə',
                value: 0,
                navName: '/demands/demandreturns'
            });
        }

        setDemandSums(arr);
    }

    async function fetchingPaymentAmounts() {
        let obj = {
            advance: 'hide',
            dr: 1,
            lm: 100,
            pg: 0,
            sr: 'Moment',
            ownerName: owner,
            token: await AsyncStorageWrapper.getItem('token'),
            ...dateFilter
        };

        let paydirs = ['i', 'o'];
        let list = [];

        for (let index = 0; index < paydirs.length; index++) {
            let payType = paydirs[index];
            await api('transactions/get.php', {
                ...obj,
                paydir: paydirs[index]
            })
                .then(element => {
                    if (element != null) {
                        list.push(
                            {
                                key: payType == 'i' ? 'Mədaxil' : "Məxaric",
                                value: formatPrice(payType == 'i' ? element.InSum : element.OutSum),
                                navName: '/transactions'
                            }
                        );
                    }
                })
                .catch(err => {
                    ErrorMessage(err);
                });
        }

        setPaymentSums(list);
    }

    async function fetchingDebtAmounts() {
        let obj = {
            ar: null,
            dr: 0,
            gp: null,
            lm: 100,
            pg: 0,
            sr: 'CustomerName',
            ownerName: owner,
            ownerid: owner,
            token: await AsyncStorageWrapper.getItem('token'),
            zeors: 3,
        };

        await api('settlements/get.php', obj).then((element) => {
            if (element != null) {
                setDebtsSums([
                    {
                        key: 'Alınacaq',
                        value: formatPrice(element.AllInSum),
                        navName: "/settlements"
                    },
                    {
                        key: 'Veriləcək',
                        value: formatPrice(element.AllOutSum),
                        navName: '/settlements'
                    }
                ]);
            }
        })
            .catch(err => {
                ErrorMessage(err);
            });
    }

    async function fetchingCustomerOrderAndMoveAllSum() {
        let list = [];
        let result = await api('customerorders/get.php', {
            dr: 1,
            lm: 100,
            pg: 0,
            sr: 'Moment',
            ownerName: owner,
            token: await AsyncStorageWrapper.getItem('token'),
            ...dateFilter
        });

        if (result != null) {
            list.push({
                key: 'Sifariş',
                value: formatPrice(result.AllSum),
                navName: "/customer-orders"
            });
        }

        let move = await api('moves/get.php', {
            dr: 1,
            lm: 100,
            pg: 0,
            sr: 'Moment',
            ownerName: owner,
            token: await AsyncStorageWrapper.getItem('token'),
            ...getDateByIndex(0)
        });

        if (move != null) {
            list.push({
                key: 'Yerdəyişmə',
                value: formatPrice(move.AllSum),
                navName: "/moves"
            });
        }

        setCustomerOrderAndMoves(list);
    }

    async function fetchOwner() {
        await api('permissions/get.php', {
            token: await AsyncStorageWrapper.getItem('token')
        }).then(element => {
            if (element != null) {
                setOwner(element.OwnerId);
            }
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        fetchOwner();
    }, []);

    useEffect(() => {
        if (owner != null) {
            fetchingCashes();
            fetchingDebtAmounts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner]);

    useEffect(() => {
        if (owner != null) {
            if (demandSums[0]) {
                setDemandSums([]);
            }

            if (customerOrderAndMoveSums[0]) {
                setCustomerOrderAndMoves([]);
            }

            if (paymentSums[0]) {
                setPaymentSums([]);
            }

            fetchingDemandAmounts();
            fetchingPaymentAmounts();
            fetchingCustomerOrderAndMoveAllSum();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFilter, owner]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--adm-color-background)',
            overflow: 'hidden'
        }}>
            <ListPagesHeader header={'Distributorlar'} />

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16
            }}>
                {
                    permission_ver(permissions, 'owner', 'R') ?
                        owner != null ?
                            <Selection
                                apiBody={{}}
                                apiName={'owners/get.php'}
                                change={(e) => {
                                    setOwner(e.Id);
                                }}
                                title={'Cavabdeh'}
                                value={owner}
                            />
                            :
                            ""
                        :
                        ""
                }

                <DocumentTimes
                    filter={dateFilter}
                    setFilter={setDateFilter}
                    selected={selectedTime}
                    setSelected={setSelectedTime}
                />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    marginTop: 16
                }}>

                    {renderCard(
                        'Satışlar',
                        <AiOutlineShoppingCart size={24} color="#ff9c6e" />,
                        [...demandSums]
                    )}

                    {renderCard(
                        'Distributor',
                        <AiOutlineAppstore size={24} color="var(--adm-color-primary)" />,
                        [...customerOrderAndMoveSums]
                    )}

                    {renderCard(
                        'Ödənişlər',
                        <BsCashCoin size={24} color="#ff85c0" />,
                        [...paymentSums]
                    )}

                    {renderCard(
                        'Borclar',
                        <AiOutlineBank size={24} color="#ff4d4f" />,
                        [...debtSums]
                    )}
                </div>

                <div style={{ marginTop: 16 }}>
                    {renderCard(
                        'Balans',
                        <AiOutlineWallet size={24} color="#ffa940" />,
                        cashes == null ?
                            null :
                            cashes[0] ?
                                cashes.map(element => ({
                                    key: element.Name, value: formatPrice(element.Balance),
                                    navName: "/cashe/cashe-manage",
                                    navParams: {
                                        id: element.Id,
                                        name: element.Name,
                                        balance: formatPrice(element.Balance)
                                    }
                                }))
                                :
                                [],
                        { width: '100%' }
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpeditorList;
