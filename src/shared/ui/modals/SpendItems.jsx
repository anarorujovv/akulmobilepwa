import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';
import Input from '../Input';
import contains from '../../../services/contains';

const SpendItemsModal = ({
    modalVisible,
    setModalVisible,
    document,
    setDocument,
    target,
    types
}) => {

    const theme = useTheme();
    const [spendItems, setSpendItems] = useState([]);

    const fetchingSpendItems = async () => {
        await api('spenditems/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setSpendItems([...element.List]);
                } else {
                    setSpendItems(null);
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
                    setDocument(rel => ({ ...rel, ['SpendItem']: item.Id }));
                    setModalVisible(false);
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
        if (modalVisible && spendItems != null && !spendItems[0]) {
            fetchingSpendItems();
        }
    }, [modalVisible])

    useEffect(() => {
        fetchingSpendItems();
    }, [])

    const styles = {
        trigger: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
        },
        loadingTrigger: {
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
        },
        scrollContainer: {
            width: '100%',
            height: '100%',
            overflowY: 'auto'
        }
    }

    return (
        <>
            {
                spendItems[0] ?
                    <div
                        style={styles.trigger}
                        onClick={() => {
                            if (types.direct == 'outs') {
                                setModalVisible(true);
                            }
                        }}
                    >
                        <Input
                            isRequired={true}
                            width={'70%'}
                            disabled={true}
                            value={contains(spendItems, document.SpendItem) == null ? "" : contains(spendItems, document.SpendItem).Name}
                            placeholder={"Xərc maddəsi"}
                        />

                    </div>
                    :
                    <div style={styles.loadingTrigger}>
                        <div className="spinner"></div>
                    </div>
            }
            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
                height={"100%"}
            >
                {
                    spendItems == null ?

                        <div style={styles.noDataContainer}>
                            <span style={{
                                fontSize: 16,
                                color: theme.primary
                            }}>Məlumat tapılmadı...</span>
                        </div>

                        :

                        <div style={styles.listContainer}>
                            <div style={styles.scrollContainer}>
                                {
                                    spendItems[0] ?
                                        spendItems.map((item, index) => (
                                            renderItem(item, index)
                                        ))
                                        :
                                        <div style={styles.noDataContainer}>
                                            <div className="spinner"></div>
                                        </div>
                                }
                            </div>
                        </div>
                }
            </MyModal>
        </>
    )
}

export default SpendItemsModal;