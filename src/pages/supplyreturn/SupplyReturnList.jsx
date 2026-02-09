import React, { useCallback, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import FabButton from '../../shared/ui/FabButton';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const SupplyReturnList = () => {
    const navigate = useNavigate();
    let theme = useTheme();
    let permissions = useGlobalStore(state => state.permissions);

    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [itemSize, setItemSize] = useState(0);

    const [filter, setFilter] = useState({
        dr: 1,
        sr: "Moment",
        pg: 1,
        lm: 20,
        agrigate: 1
    });

    const [selectedTime, setSelectedTime] = useState(null);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        deleteButton: {
            backgroundColor: theme.red,
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: '100%',
        },
        deleteText: {
            color: theme.bg,
            fontWeight: 'bold',
            fontSize: 16
        },
        listContainer: {
            flex: 1,
            overflowY: 'auto',
            paddingBottom: 80
        },
        loadingContainer: {
            width: '100%',
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex'
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            paddingTop: 50
        }
    }

    const fetchingDocumentData = async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') }
        obj.pg = obj.pg - 1;

        await api('supplyreturns/get.php', obj)
            .then((element) => {
                if (element != null) {
                    setItemSize(element.Count);
                    if (filter.agrigate == 1) {
                        setDocumentsInfo(element);
                    }
                    setDocuments(element.List[0] ? [...element.List] : [])
                }
            })
            .catch((err) => {
                ErrorMessage(err)
            })
            .finally(() => {
                setIsRefreshing(false);
            });
    }

    const handleDelete = async (id) => {
        if (permission_ver(permissions, 'supplyreturn', 'D')) {
            await api('supplyreturns/del.php?id=' + id, {
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
            ErrorMessage("İcazə yoxdur!")
        }
    }

    const RenderFooter = () => {
        return (
            documents.length == 20 || filter.pg != 1 ?
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
                :
                ""
        )
    }

    const renderItem = (item, index) => (
        <div key={item.Id}>
            <ListItem
                onLongPress={() => {
                    if (window.confirm('Alış silməyə əminsiniz?')) {
                        handleDelete(item.Id);
                    }
                }}
                centerText={item.CustomerName}
                endText={item.Moment}
                notIcon={true}
                priceText={formatPrice(item.Amount)}
                onPress={() => {
                    if (permission_ver(permissions, 'supplyreturn', 'R')) {
                        navigate('/supplyreturn/supply-return-manage', {
                            state: { id: item.Id }
                        })
                    } else {
                        ErrorMessage('İcazəniz yoxdur!')
                    }
                }}
                index={index + 1}
            />
        </div>
    );

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
                isSearch={true}
                header={'İade Alışlar'}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
                            // setFilter: setFilter,
                            searchParams: [
                                'product',
                                'stocks',
                                'owners',
                                'documentName'
                            ],
                            sortList: [
                                {
                                    id: '1',
                                    label: 'Tarix',
                                    value: "Moment"
                                },
                                {
                                    id: '2',
                                    label: 'Anbar',
                                    value: 'StockName'
                                },
                                {
                                    id: '3',
                                    label: "Məbləğə görə",
                                    value: 'Amount'
                                },
                                {
                                    id: '4',
                                    label: 'Status',
                                    value: "Mark"
                                }
                            ],
                        }
                    });
                }}
            />

            <DocumentTimes
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            {
                documentsInfo != null ? (
                    <DocumentInfo
                        data={[
                            {
                                title: "Məbləğ",
                                value: formatPrice(documentsInfo.AllSum)
                            }
                        ]}
                    />
                )
                    :
                    <div style={styles.loadingContainer}>
                        <div className="spinner" style={{ width: 15, height: 15 }}></div>
                    </div>
            }

            <div style={styles.listContainer}>
                {
                    documents == null ?

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="spinner"></div> // Web spinner
                        </div>

                        :
                        <>
                            {documents.length === 0 ? (
                                <div style={styles.emptyContainer}>
                                    <span style={{ color: theme.text }}>List boşdur</span>
                                </div>
                            ) : (
                                documents.map((item, index) => renderItem(item, index))
                            )}
                            <RenderFooter />
                        </>
                }
            </div>

            <FabButton
                onPress={() => {
                    if (permission_ver(permissions, 'supplyreturn', 'C')) {
                        navigate('/supplyreturn/supply-return-manage', {
                            state: { id: null }
                        })
                    }
                }}
            />
        </div>
    )
}

export default SupplyReturnList;
