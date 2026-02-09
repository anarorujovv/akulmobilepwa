import React, { useState, useCallback, useEffect } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import FabButton from '../../shared/ui/FabButton';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from './../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import Line from '../../shared/ui/Line';
import { useNavigate } from 'react-router-dom';

const CashTransactionList = () => {
    const navigate = useNavigate();
    let theme = useTheme();
    let permissions = useGlobalStore(state => state.permissions);
    const [selectedTime, setSelectedTime] = useState(null);

    const [filter, setFilter] = useState({
        dr: 1,
        sr: "Moment",
        pg: 1,
        lm: 20,
        agrigate: 1
    });

    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [itemSize, setItemSize] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

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
            overflowY: 'auto'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flex: 1
        },
        emptyContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flex: 1,
            paddingTop: 50
        }
    };

    const fetchingDocumentData = useCallback(async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') };
        obj.pg = obj.pg - 1;

        try {
            const element = await api('cashtransactions/get.php', obj);
            if (element != null) {
                setItemSize(element.Count);
                if (filter.agrigate == 1) {
                    setDocumentsInfo(element);
                }
                setDocuments([...element.List]);
            }
        } catch (err) {
            ErrorMessage(err);
        } finally {
            setIsRefreshing(false);
        }
    }, [filter]);

    const handleDelete = async (id) => {
        if (permission_ver(permissions, 'cashtransactions', 'D')) {
            await api('cashtransactions/del.php?id=' + id, {
                token: await AsyncStorageWrapper.getItem('token')
            }).then(element => {
                if (element != null) {
                    setDocuments([]);
                    fetchingDocumentData();
                }
            }).catch(err => {
                ErrorMessage(err)
            })
        } else {
            ErrorMessage("İcazə yoxdur!");
        }
    };

    useEffect(() => {
        setDocuments(null);
        let time = setTimeout(() => {
            fetchingDocumentData();
        }, 300);

        return () => clearTimeout(time);
    }, [filter]);

    return (
        <div style={styles.container}>
            <ListPagesHeader
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                header={'Transferlər'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigate("/filter", {
                        state: {
                            filter: filter,
                            // setFilter: setFilter, 
                            searchParams: [
                                'documentName',
                                'product',
                                'departments',
                                'owners',
                            ],
                            sortList: [
                                { id: 1, label: 'Ad', value: "Name" },
                                { id: 2, label: 'Tarix', value: 'Moment' },
                                { id: 3, label: 'Məbləğ', value: 'Amount' }
                            ]
                        }
                    })
                }}
            />

            <DocumentTimes
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            {documentsInfo != null ? (
                <DocumentInfo data={[
                    {
                        title: "Məbləğ",
                        value: formatPrice(documentsInfo.AllSum)
                    }
                ]} />
            ) : (
                <div style={{
                    width: '100%',
                    height: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className="spinner" style={{ width: 15, height: 15 }}></div>
                    <Line width={'100%'} />
                </div>
            )}

            <div style={styles.listContainer}>
                {documents == null ? (
                    <div style={styles.loadingContainer}>
                        <div className="spinner"></div> // Global spinner class
                    </div>
                ) : (
                    <>
                        {documents.length === 0 ? (
                            <div style={styles.emptyContainer}>
                                <span style={{ color: theme.text }}>List boşdur</span>
                            </div>
                        ) : (
                            documents.map((item, index) => (
                                <div key={item.Id}>
                                    <ListItem
                                        onLongPress={() => {
                                            if (window.confirm('Satışı silməyə əminsiniz?')) {
                                                handleDelete(item.Id);
                                            }
                                        }}
                                        firstText={item.Name}
                                        centerText={item.Moment}
                                        endText={`${item.CashFromName} -> ${item.CashToName}`}
                                        notIcon={true}
                                        index={index + 1}
                                        onPress={() => {
                                            if (permission_ver(permissions, 'cashtransactions', 'R')) {
                                                navigate('/cashtransactions/cash-transaction-manage', {
                                                    state: { id: item.Id }
                                                });
                                            } else {
                                                ErrorMessage('İcazəniz yoxdur!')
                                            }
                                        }}
                                    />
                                </div>
                            ))
                        )}
                        {(documents.length == 20 || filter.pg != 1) && (
                            <MyPagination
                                itemSize={itemSize}
                                page={filter.pg}
                                setPage={(e) => {
                                    let filterData = { ...filter };
                                    filterData.agrigate = 0;
                                    filterData.pg = e;
                                    setFilter(filterData);
                                }}
                                pageSize={20}
                            />
                        )}
                    </>
                )}
            </div>

            <FabButton
                onPress={() => {
                    if (permission_ver(permissions, 'cashtransactions', 'C')) {
                        navigate('/cashtransactions/cash-transaction-manage', {
                            state: { id: null }
                        });
                    }
                }}
            />
        </div>
    );
};

export default CashTransactionList;
