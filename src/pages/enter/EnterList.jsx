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
import translatePayed from './../../services/report/translatePayed';
import { useNavigate } from 'react-router-dom';

const EnterList = () => {
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
    })

    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [itemSize, setItemSize] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex'
        },
        listContainer: {
            flex: 1,
            overflowY: 'auto',
            paddingBottom: 80
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            paddingTop: 50
        }
    }

    const fetchingDocumentData = useCallback(async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') }
        obj.pg = obj.pg - 1;

        try {
            const element = await api('enters/get.php', obj);
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
        if (permission_ver(permissions, 'enters', 'D')) {
            await api('enters/del.php?id=' + id, {
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
                index={index + 1}
                onLongPress={() => {
                    if (window.confirm('Yerdəyişmə silməyə əminsiniz?')) {
                        handleDelete(item.Id);
                    }
                }}
                {...translatePayed(item.Payed)}
                centerText={item.StockName}
                firstText={item.Name}
                endText={item.Moment}
                notIcon={true}
                priceText={formatPrice(item.Amount)}
                onPress={() => {
                    if (permission_ver(permissions, 'enter', 'R')) {
                        navigate('/enter/enter-manage', {
                            state: { id: item.Id }
                        })
                    } else {
                        ErrorMessage('İcazəniz yoxdur!')
                    }
                }}
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
                header={'Daxilolmalar'}
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
                                'documentName',
                                'product',
                                'stocks',
                                'owners',
                                'departments'
                            ],
                            sortList: [
                                {
                                    id: '1',
                                    label: 'Tarix',
                                    value: "Moment"
                                },
                                {
                                    id: 2,
                                    label: 'Ad',
                                    value: 'Name'
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
                                },
                                {
                                    id: '5',
                                    label: 'Anbar',
                                    value: "StockName"
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
                {
                    documents == null ?
                        <div style={styles.loadingContainer}>
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
                    if (permission_ver(permissions, 'enter', 'C')) {
                        navigate('/enter/enter-manage', {
                            state: { id: null }
                        })
                    }
                }}
            />
        </div>
    )
}

export default EnterList;
