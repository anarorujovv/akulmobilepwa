import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import SearchHeader from './../SearchHeader';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import Input from '../Input';
import { formatPrice } from '../../../services/formatPrice';

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
    }

    const renderItem = (item, index) => {

        return (
            <div key={item.Id || index} style={{ width: '100%' }}>
                <div onClick={() => {
                    handleSelectCustomer(item);
                    if (returnChanged) {
                        returnChanged();
                    }
                }}
                    style={{
                        width: '100%',
                        height: 55,
                        paddingLeft: 20,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.input.grey}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{
                        color: theme.black,
                        fontSize: 13
                    }}>{item.Name}</span>
                </div>
                <Line width={'90%'} />
            </div>
        )
    }
    useEffect(() => {
        if (!modalVisible) {
            setSearch("");
        }
    }, [modalVisible])

    useEffect(() => {
        let time;
        if (search != null) { // search null initial state, but fetchingCustomers runs initially if search logic allows. Actually fetchingCustomers called in else block.
            // Initial load logic seems a bit mixed in original code.
            // Original: search is "" initially? No "const [search, setSearch] = useState("");"
            // But logic: if (search != null) ...
            // Let's keep it close to original.
            setCustomers([])
            if (search !== "") {
                time = setTimeout(() => {
                    fetchingFastCustomers();
                }, 400);
            } else {
                fetchingCustomers();
            }
        }
        return () => clearTimeout(time);
    }, [search])

    const styles = {
        trigger: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: isDisable ? 'default' : 'pointer'
        },
        debtRow: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%', // width prop was passed but handled via style here
            justifyContent: 'space-between'
        },
        noDataContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        listContainer: {
            width: '100%',
            height: '100%',
            overflowY: 'auto'
        }
    }

    return (
        <>
            <div
                style={styles.trigger}
                onClick={() => {
                    if (!isDisable) {
                        setModalVisible(true);
                    }
                }}
            >
                <Input
                    isRequired={true}
                    width={width}
                    disabled={true}
                    value={document.CustomerName == null ? "" : document.CustomerName}
                    placeholder={!isName ? 'Qarşı-tərəf' : "Təchizatçı"}
                />
                {
                    isDebtPermission ?
                        customerDebt != null ?
                            <div
                                style={{
                                    ...styles.debtRow,
                                    width: width // override or ensure width
                                }}
                            >
                                <span style={{ fontSize: 12, color: theme.orange }}>Qalıq borc</span>
                                <span style={{ fontSize: 12, color: customerDebt >= 0 ? theme.black : theme.orange }}>{customerDebt} ₼</span>
                            </div>
                            :
                            ""
                        :
                        ""
                }
            </div>
            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
            >
                <SearchHeader
                    placeholder={'Müştəri axtarışı...'}
                    value={search}
                    onChange={(e) => {
                        setSearch(e)
                    }}
                    onPress={() => {
                        setModalVisible(false)
                    }}
                />

                {
                    customers == null ?
                        <div style={styles.noDataContainer}>
                            <span style={{
                                fontSize: 16,
                                color: theme.primary
                            }}>Məlumat tapılmadı...</span>
                        </div>
                        :
                        <div style={styles.listContainer}>
                            {
                                customers[0] ?
                                    customers.map((item, index) => renderItem(item, index))
                                    :
                                    <div style={styles.noDataContainer}>
                                        <div className="spinner"></div>
                                    </div>
                            }
                        </div>
                }
            </MyModal>
        </>
    )
}

export default CustomersModal;