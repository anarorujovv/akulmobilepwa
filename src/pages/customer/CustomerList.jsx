import React, { useEffect, useState } from 'react';
import { SpinLoading, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import ListItem from '../../shared/ui/list/ListItem';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [itemSize, setItemSize] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filter, setFilter] = useState({
        dr: 0,
        sr: "GroupName",
        pg: 1,
        gp: "",
        lm: 20,
        ar: 0,
        fast: ""
    });

    const fetchingCustomers = async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') };
        obj.pg = obj.pg - 1;
        await api('customers/get.php', obj)
            .then(element => {
                if (element != null) {
                    setItemSize(element.Count);
                    setCustomers([...element.List]);
                }
            }).catch(err => {
                ErrorMessage(err);
            }).finally(() => {
                setIsRefreshing(false);
            });
    };

    const fetchingFastCustomers = async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem("token") };
        obj.pg = obj.pg - 1;

        await api(
            'customers/getfast.php', obj
        ).then((element) => {
            if (element != null) {
                setItemSize(element.Count);
                setCustomers([...element.List]);
            }
        }).catch((err) => {
            ErrorMessage(err);
        }).finally(() => {
            setIsRefreshing(false);
        });
    };

    useEffect(() => {
        setCustomers([]); // Clear list on filter change
        let time;
        if (filter.fast == "") {
            fetchingCustomers();
        } else {
            time = setTimeout(() => {
                fetchingFastCustomers();
            }, 400);
        }

        return () => clearTimeout(time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const renderItem = (item, index) => (
        <React.Fragment key={item.Id}>
            <ListItem
                index={index + 1}
                onPress={() => {
                    navigate("/customer/customer-manage", {
                        state: { id: item.Id }
                    });
                }}
                firstText={item.Phone}
                centerText={item.Name}
                endText={item.Card}
                notIcon={true}
            />
        </React.Fragment>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--adm-color-background)',
            overflow: 'hidden'
        }}>
            <ListPagesHeader
                header={"Tərəf-müqabilləri"}
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'fast'}
            />
            {customers == null ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <SpinLoading color='primary' style={{ '--size': '40px' }} />
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingBottom: 80,
                    padding: '0 12px 80px 12px'
                }}>
                    {customers.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: 'var(--adm-color-weak)'
                        }}>
                            <span>List boşdur</span>
                        </div>
                    ) : (
                        <>
                            {customers.map((item, index) => renderItem(item, index))}
                            <MyPagination
                                itemSize={itemSize}
                                page={filter.pg}
                                setPage={(e) => {
                                    setCustomers([]);
                                    setFilter(rel => ({ ...rel, pg: e }));
                                }}
                                pageSize={20}
                            />
                        </>
                    )}
                </div>
            )}

            <FloatingBubble
                style={{
                    '--initial-position-bottom': '24px',
                    '--initial-position-right': '24px',
                    '--edge-distance': '24px',
                    '--background': 'var(--adm-color-primary)',
                    '--size': '56px'
                }}
                onClick={() => {
                    navigate("/customer/customer-manage", {
                        state: { id: null }
                    });
                }}
            >
                <AddOutline fontSize={28} color='#fff' />
            </FloatingBubble>
        </div>
    );
};

export default CustomerList;
