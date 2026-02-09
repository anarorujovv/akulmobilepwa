import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import Input from '../Input';
import contains from '../../../services/contains';
import { formatPrice } from '../../../services/formatPrice';

const CashToModal = ({
    document,
    setDocument,
}) => {

    const theme = useTheme();

    const [cashs, setCashs] = useState([]);
    const [cashModal, setCashModal] = useState(false);

    const fetchingCashes = async () => {
        await api('cashes/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setCashs([...element.List]);
                } else {
                    setCashs(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }

    const renderItem = (item, index) => {
        return (
            <div key={item.Id || index} style={{ width: '100%' }}>
                <div onClick={() => {
                    setDocument(rel => ({ ...rel, ['CashToName']: item.Name }))
                    setDocument(rel => ({ ...rel, ['CashToId']: item.Id }));
                    setCashModal(false);
                }}
                    style={{
                        width: '100%',
                        height: 55,
                        paddingLeft: 20,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
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
        if (cashModal && cashs != null && !cashs[0]) {
            fetchingCashes();
        }
    }, [cashModal])


    useEffect(() => {
        fetchingCashes();
    }, [])

    const styles = {
        trigger: {
            width: "100%",
            display: "flex",
            flexDirection: 'column',
            alignItems: "center",
            cursor: 'pointer',
        },
        balanceRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '70%'
        },
        loadingCenter: {
            width: '100%',
            height: 55,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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
    };

    return (
        <>
            {
                cashs[0] ?
                    <div
                        style={styles.trigger}
                        onClick={() => {
                            setCashModal(true);
                        }}
                    >
                        <Input
                            isRequired={true}
                            width={'70%'}
                            disabled={true}
                            value={document.CashToName}
                            placeholder={'Hesaba'}
                        />
                        {
                            contains(cashs, document.CashToId) == null ? "" :
                                <div
                                    style={styles.balanceRow}
                                >
                                    <span style={{ fontSize: 12, color: theme.red }}>Balans</span>
                                    <span style={{ fontSize: 12, color: theme.red }}>{formatPrice(contains(cashs, document.CashToId).Balance)} ₼</span>
                                </div>

                        }
                    </div>

                    :
                    <div style={styles.loadingCenter}>
                        <div className="spinner"></div>
                    </div>
            }
            <MyModal
                modalVisible={cashModal}
                setModalVisible={setCashModal}
                width={'100%'}
                height={"100%"}
            >
                {
                    cashs == null ?
                        <div style={styles.noDataContainer}>
                            <span style={{
                                fontSize: 16,
                                color: theme.primary
                            }}>Məlumat tapılmadı...</span>
                        </div>
                        :
                        <div style={styles.listContainer}>
                            {
                                cashs[0] ?
                                    cashs.map((item, index) => renderItem(item, index))
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

export default CashToModal;