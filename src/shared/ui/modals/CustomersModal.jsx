import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import { List, Input, SearchBar, SpinLoading, AutoCenter } from 'antd-mobile';

const CustomersModal = ({
    document,
    setDocument,
    isDisable,
    isName,
    width,
    returnChanged,
    isDebtPermission = true
}) => {
    const theme = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [customerDebt, setCustomerDebt] = useState(null);

    const fetchingCustomers = async () => {
        await api('customers/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
            sr: "Name",
            lm: 40
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setCustomers([...element.List]);
                } else {
                    setCustomers(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })

        if (document.CustomerName != '') {
            fetchingCustomerDebt(document.CustomerId);
        }
    }

    const fetchingCustomerDebt = async (id) => {
        await api('customers/getdata.php', {
            id: id,
            token: await AsyncStorageWrapper.getItem('token')
        })
            .then(element => {
                if (element != null) {
                    setCustomerDebt(formatPrice(element.Debt));
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    const fetchingFastCustomers = async () => {
        await api("customers/getfast.php", {
            fast: search,
            token: await AsyncStorageWrapper.getItem("token")
        }).then(async element => {
            if (element != null) {
                if (element.List[0]) {
                    setCustomers([...element.List]);
                } else {
                    setCustomers(null);
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })

    }

    const handleSelectCustomer = async (item) => {
        await fetchingCustomerDebt(item.Id);
        setDocument(rel => ({ ...rel, ['CustomerName']: item.Name }))
        setDocument(rel => ({ ...rel, ['CustomerId']: item.Id }));
        setModalVisible(false);
        if (returnChanged) {
            returnChanged();
        }
    }

    useEffect(() => {
        if (!modalVisible) {
            setSearch("");
        }
    }, [modalVisible])

    useEffect(() => {
        let time;
        if (search != null) {
            setCustomers([])
            if (search !== "") {
                time = setTimeout(() => {
                    fetchingFastCustomers();
                }, 400);
            } else {
                fetchingCustomers(); // Also handles initial fetch when search is empty string (though initial state is "", so it runs)
            }
        }
        return () => clearTimeout(time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    return (
        <>
            <div
                onClick={() => {
                    if (!isDisable) {
                        setModalVisible(true);
                    }
                }}
                style={{
                    width: width || '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center', // If width is 100%, center might not be desired if it's full block. Let's rely on width.
                    // But original had 'alignItems: center' and `width: '100%'` on trigger container.
                    alignItems: 'center',
                    cursor: isDisable ? 'default' : 'pointer'
                }}
            >
                <div style={{
                    width: '100%', // Input takes full width of this container, which is constrained by parent 'width' prop effectively if passed to wrapper?
                    // Wait, original wrapper had width='100%' in styles.trigger.
                    // Input had width={width} passed.
                    // So if Width="70%", Input was 70%.
                    // I should apply width to this inner div.
                    width: width || '100%',
                    border: '1px solid #e5e5e5',
                    borderRadius: 4,
                    padding: '6px 12px',
                    backgroundColor: '#fff'
                }}>
                    <Input
                        readOnly
                        value={document.CustomerName == null ? "" : document.CustomerName}
                        placeholder={!isName ? 'Qarşı-tərəf' : "Təchizatçı"}
                        style={{ '--font-size': '14px' }}
                    />
                </div>

                {isDebtPermission && customerDebt != null && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: width || '100%',
                        justifyContent: 'space-between',
                        marginTop: 5
                    }}>
                        <span style={{ fontSize: 12, color: theme.orange }}>Qalıq borc</span>
                        <span style={{ fontSize: 12, color: customerDebt >= 0 ? theme.black : theme.black }}>{customerDebt} ₼</span>
                    </div>
                )}
            </div>

            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
                height={'100%'}
            >
                <div style={{ padding: '10px' }}>
                    <SearchBar
                        placeholder='Müştəri axtarışı...'
                        value={search}
                        onChange={setSearch}
                        onCancel={() => setModalVisible(false)}
                        cancelText='Ləğv'
                        showCancelButton
                        style={{ '--background': '#f5f5f5' }}
                    />
                </div>

                <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
                    {customers === null ? (
                        <AutoCenter style={{ padding: 20, color: theme.primary }}>
                            Məlumat tapılmadı...
                        </AutoCenter>
                    ) : !customers.length ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                            <SpinLoading color='primary' />
                        </div>
                    ) : (
                        <List>
                            {customers.map((item, index) => (
                                <List.Item
                                    key={item.Id || index}
                                    onClick={() => handleSelectCustomer(item)}
                                    arrow={false}
                                >
                                    {item.Name}
                                </List.Item>
                            ))}
                        </List>
                    )}
                </div>
            </MyModal>
        </>
    )
}

export default CustomersModal;