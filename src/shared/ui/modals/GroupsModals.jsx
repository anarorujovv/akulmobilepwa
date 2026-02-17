import React, { useEffect, useState } from 'react';
import MyModal from './../MyModal';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../RepllyMessage/ErrorMessage';
import useTheme from '../../theme/useTheme';
import { List, SearchBar, SpinLoading, AutoCenter } from 'antd-mobile';

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
            if (search !== "") {
                time = setTimeout(() => {
                    fetchingFastGroups();
                }, 400);
            } else {
                fetchingGroups();
            }
        }

        return () => clearTimeout(time);
    }, [search])

    return (
        <MyModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            width={'100%'}
        >
            <div style={{ padding: '10px' }}>
                <SearchBar
                    placeholder={'Qrup axtarışı...'}
                    value={search || ''}
                    onChange={setSearch}
                    onCancel={() => setModalVisible(false)}
                    cancelText='Ləğv'
                    showCancelButton
                    style={{ '--background': '#f5f5f5' }}
                />
            </div>

            <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
                {groups === null ? (
                    <AutoCenter style={{ padding: 20, color: theme.primary }}>
                        Məlumat tapılmadı...
                    </AutoCenter>
                ) : !groups.length ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                        <SpinLoading color='primary' />
                    </div>
                ) : (
                    <List header='Qruplar'>
                        {groups.map((item, index) => (
                            <List.Item
                                key={item.Id || index}
                                onClick={() => {
                                    setProduct(rel => ({ ...rel, ['GroupName']: item.Name }));
                                    setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
                                    setModalVisible(false);
                                }}
                                arrow={false}
                            >
                                {item.Name}
                            </List.Item>
                        ))}
                    </List>
                )}
            </div>
        </MyModal>
    )
}

export default GroupsModal;