import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import { AiOutlineShoppingCart, AiOutlineBank, AiOutlineWallet, AiOutlineAppstore } from 'react-icons/ai';
import { BsCashCoin } from 'react-icons/bs';
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

const ExpeditorList = () => {
    const navigate = useNavigate();
    const theme = useTheme();

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

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        scrollView: {
            flex: 1,
            overflowY: 'auto',
            padding: 15
        },
        headerText: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
            width: '100%',
            color: theme.primary,
            marginTop: 10
        },
        gridContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 15
        },
        cardContainer: {
            width: 'calc(50% - 10px)',
            borderRadius: 10,
            padding: 15,
            border: '1px solid #ddd',
            backgroundColor: theme.whiteGrey,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            boxSizing: 'border-box',
            marginBottom: 15
        },
        cardHeader: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: 10,
            color: theme.primary
        },
        cardContent: {
            marginTop: 10,
        },
        cardItem: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
            cursor: 'pointer'
        },
        cardItemKey: {
            fontSize: 14,
            color: theme.primary,
            textDecoration: "underline"
        },
        cardItemValue: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme.black
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10
        }
    };

    const renderCard = (title, icon, items, style = {}) => (
        <div style={{ ...styles.cardContainer, ...style }}>
            <div style={styles.cardHeader}>
                {icon}
                <span style={styles.cardTitle}>{title}</span>
            </div>
            <div style={styles.cardContent}>
                {items != null ? (
                    items[0] ? (
                        items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    if (item.navParams == undefined) {
                                        navigate(item.navName);
                                    } else {
                                        // Pass state for React Router
                                        navigate(item.navName, { state: { ...item.navParams } });
                                    }
                                }}
                                style={styles.cardItem}
                            >
                                <span style={styles.cardItemKey}>{item.key}</span>
                                <span style={styles.cardItemValue}>{item.value}</span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.loadingContainer}>
                            <div className="spinner" style={{ width: 20, height: 20 }}></div>
                        </div>
                    )
                ) : (
                    ""
                )}
            </div>
        </div>
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
                navName: "/demands/demand" // Updated path
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
                navName: '/demands/demandreturns' // Updated path
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
                                navName: '/transactions' // Updated path
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
                        navName: "/settlements" // Updated path
                    },
                    {
                        key: 'Veriləcək',
                        value: formatPrice(element.AllOutSum),
                        navName: '/settlements' // Updated path
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
                navName: "/customer-orders" // Updated path
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
                navName: "/moves" // Updated path
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
    }, [dateFilter, owner]);

    return (
        <div style={styles.container}>
            <div style={styles.scrollView}>
                <span style={styles.headerText}>Distributorlar</span>
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

                <div style={styles.gridContainer}>

                    {renderCard(
                        'Satışlar',
                        <AiOutlineShoppingCart size={24} color={theme.orange} />,
                        [...demandSums]
                    )}

                    {renderCard(
                        'Distributor',
                        <AiOutlineAppstore size={24} color={theme.primary} />,
                        [...customerOrderAndMoveSums]
                    )}

                    {renderCard(
                        'Ödənişlər',
                        <BsCashCoin size={24} color={theme.pink} />,
                        [...paymentSums]
                    )}

                    {renderCard(
                        'Borclar',
                        <AiOutlineBank size={24} color={theme.red} />,
                        [...debtSums]
                    )}

                    {renderCard(
                        'Balans',
                        <AiOutlineWallet size={24} color={theme.orange} />,
                        cashes == null ?
                            null :
                            cashes[0] ?
                                cashes.map(element => ({
                                    key: element.Name, value: formatPrice(element.Balance),
                                    navName: "/cashe/cashe-manage", // Updated to likely correct path
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
