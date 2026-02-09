import React, { useCallback, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import FabButton from '../../shared/ui/FabButton';
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

    let theme = useTheme();

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
            paddingBottom: 80 // Space for FabButton
        },
        loadingContainer: {
            flex: 1,
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
    }, [filter]);

    const renderItem = (item, index) => (
        <div key={item.Id}>
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
        </div>
    );

    return (
        <div style={styles.container}>
            <ListPagesHeader
                header={"Tərəf-müqabilləri"}
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'fast'}
            />
            {customers == null ? (
                <div style={styles.loadingContainer}>
                    <div className="spinner"></div> // Assuming global spinner class
                </div>
            ) : (
                <div style={styles.listContainer}>
                    {customers.length === 0 ? (
                        <div style={styles.emptyContainer}>
                            <span style={{ color: theme.text }}>List boşdur</span>
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

            <FabButton
                onPress={() => {
                    navigate("/customer/customer-manage", {
                        state: { id: null }
                    });
                }}
            />
        </div>
    );
};

export default CustomerList;
