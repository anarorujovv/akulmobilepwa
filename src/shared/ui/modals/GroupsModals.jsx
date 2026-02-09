import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import SearchHeader from './../SearchHeader';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import Line from '../Line';

const GroupsModal = ({
    modalVisible,
    setModalVisible,
    setProduct
}) => {

    const theme = useTheme();

    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState(null)

    const fetchingGroups = async () => {
        await api('productfolders/get.php', {
            token: await AsyncStorageWrapper.getItem('token'),
            lm: 40
        }).then((element) => {
            if (element != null) {
                if (element.List[0]) {
                    setGroups([...element.List]);
                } else {
                    setGroups(null)
                }
            }
        }).catch(err => {
            ErrorMessage(err)
        })
    }


    const fetchingFastGroups = async () => {
        await api("productfolders/get.php", {
            nm: search,
            token: await AsyncStorageWrapper.getItem("token")
        }).then(async element => {
            if (element != null) {
                if (element.List[0]) {
                    setGroups([...element.List]);
                } else {
                    setGroups(null);
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
                    setProduct(rel => ({ ...rel, ['GroupName']: item.Name }))
                    setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
                    setModalVisible(false);
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
        if (modalVisible && groups != null && !groups[0]) {
            fetchingGroups();
        }

        if (!modalVisible) {
            setSearch(null)
            setGroups([])
        }
    }, [modalVisible])

    useEffect(() => {
        let time;
        if (search != null) {
            setGroups([])
            if (search != "") {
                time = setTimeout(() => {
                    fetchingFastGroups();
                }, 400);
            } else {
                fetchingGroups();
            }
        }

        return () => clearTimeout(time);
    }, [search])

    const styles = {
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
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
        >
            <SearchHeader
                placeholder={'Qrup axtarışı...'}
                value={search || ''}
                onChange={(e) => {
                    setSearch(e)
                }}
                onPress={() => {
                    setModalVisible(false)
                }}
            />

            {
                groups == null ?
                    <div style={styles.noDataContainer}>
                        <span style={{
                            fontSize: 16,
                            color: theme.primary
                        }}>Məlumat tapılmadı...</span>
                    </div>
                    :
                    <div style={styles.listContainer}>
                        {
                            groups[0] ?
                                groups.map((item, index) => renderItem(item, index))
                                :
                                <div style={styles.noDataContainer}>
                                    <div className="spinner"></div>
                                </div>
                        }
                    </div>
            }
        </MyModal>
    )
}

export default GroupsModal;