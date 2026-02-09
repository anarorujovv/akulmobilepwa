import React, { useEffect, useState } from 'react';
import MyModal from './MyModal';
import api from '../../services/api';
import AsyncStorage from '../../services/AsyncStorageWrapper';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import useTheme from '../theme/useTheme';
import Line from './Line';
import Input from './Input';
import SearchHeader from './SearchHeader';

const Selection = ({
    value,
    apiName,
    title,
    defaultValue,
    apiBody,
    change,
    bottomTitle,
    bottomText,
    isRequired,
    searchApi,
    searchKey,
    disabled
}) => {
    const theme = useTheme();
    const [info, setInfo] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [search, setSearch] = useState('');

    const fetchingData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const element = await api(apiName, {
                ...apiBody,
                token: token,
            });

            if (element != null) {
                if (element.List && element.List[0]) {
                    let list = [...element.List];
                    if (defaultValue) {
                        setSelectedValue(defaultValue);
                    } else {
                        let index = list.findIndex(rel => rel.Id == value);
                        if (index != -1) {
                            setSelectedValue(list[index].Name);
                        }
                    }
                    setInfo(list);
                } else {
                    setInfo(null);
                }
            } else {
                setInfo(null);
            }
        } catch (err) {
            ErrorMessage(err);
        }
    };

    const fetchingFastData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let obj = {
                [searchKey]: search,
                lm: 100,
                token: token
            };

            const element = await api(searchApi, obj);

            if (element != null) {
                if (element.List && element.List[0]) {
                    let list = [...element.List];
                    setInfo(list);
                } else {
                    setInfo(null);
                }
            } else {
                setInfo(null);
            }
        } catch (err) {
            ErrorMessage(err);
        }
    };

    const renderItem = (item) => {
        return (
            <div key={item.Id || Math.random()}>
                <div
                    onClick={() => {
                        if (!disabled) {
                            setSelectedValue(item.Name);
                            if (change) {
                                change(item);
                            }
                            setModalVisible(false);
                        }
                    }}
                    style={{
                        width: '100%',
                        height: 55,
                        paddingLeft: 20,
                        display: 'flex',
                        justifyContent: 'center',
                        cursor: disabled ? 'default' : 'pointer',
                        backgroundColor: theme.bg
                    }}
                >
                    <span style={{
                        color: theme.black,
                        fontSize: 13
                    }}>{item.Name}</span>
                </div>
                <Line width={'90%'} />
            </div>
        );
    };

    useEffect(() => {
        if (searchApi == undefined) {
            fetchingData();
        }
    }, []);

    useEffect(() => {
        let time;
        if (search == '') {
            fetchingData();
        } else {
            if (info == null || (info && info[0])) {
                setInfo([]);
            }
            time = setTimeout(() => {
                fetchingFastData();
            }, 400);
        }

        return () => clearTimeout(time);
    }, [search]);

    const styles = {
        container: {
            width: "100%",
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center",
            cursor: disabled ? 'default' : 'pointer'
        },
        bottomTextContainer: {
            display: 'flex',
            flexDirection: 'row',
            width: '70%',
            justifyContent: 'space-between'
        },
        loadingContainer: {
            width: '100%',
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        loadingInner: {
            width: '70%',
            height: 50,
            borderBottom: `1px solid ${theme.input.grey}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        },
        notFound: {
            width: '70%',
            height: 50,
            borderBottom: `1px solid ${theme.input.grey}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }
    };

    return (
        <>
            {info == null ? (
                defaultValue != undefined ? (
                    <div style={styles.container}>
                        <Input
                            isRequired={isRequired}
                            width={'70%'}
                            disabled={true}
                            value={defaultValue}
                            placeholder={title}
                        />
                        {bottomText != undefined && (
                            <div style={styles.bottomTextContainer}>
                                <span style={{ fontSize: 12, color: theme.orange }}>{bottomTitle}</span>
                                <span style={{ fontSize: 12, color: bottomText >= 0 ? theme.black : theme.green }}>{bottomText} ₼</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={styles.loadingContainer}>
                        <div style={styles.notFound}>
                            <span style={{ color: theme.black }}>Anbar tapılmadı</span>
                        </div>
                    </div>
                )
            ) : info[0] ? (
                <div
                    style={styles.container}
                    onClick={() => {
                        if (!disabled) {
                            setModalVisible(true);
                        }
                    }}
                >
                    <Input
                        isRequired={isRequired}
                        width={'70%'}
                        disabled={true}
                        value={selectedValue}
                        placeholder={title}
                    />
                    {bottomText != undefined && (
                        <div style={styles.bottomTextContainer}>
                            <span style={{ fontSize: 12, color: theme.orange }}>{bottomTitle}</span>
                            <span style={{ fontSize: 12, color: bottomText >= 0 ? theme.black : theme.green }}>{bottomText} ₼</span>
                        </div>
                    )}
                </div>
            ) : (
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingInner}>
                        <div className="spinner" style={{ borderTopColor: theme.primary }}></div>
                    </div>
                </div>
            )}

            <MyModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                width={'100%'}
                height={"100%"}
            >
                {searchApi != undefined && (
                    <SearchHeader
                        placeholder={'Axtarış...'}
                        value={search}
                        onChange={(e) => setSearch(e)}
                        onPress={() => setModalVisible(false)}
                    />
                )}

                {info == null ? (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <span style={{ fontSize: 16, color: theme.primary }}>Məlumat tapılmadı...</span>
                    </div>
                ) : (
                    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        {info[0] ? (
                            info.map(item => renderItem(item))
                        ) : (
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <div className="spinner" style={{ width: 40, height: 40, borderTopColor: theme.primary }}></div>
                            </div>
                        )}
                    </div>
                )}
            </MyModal>
        </>
    );
};

export default Selection;