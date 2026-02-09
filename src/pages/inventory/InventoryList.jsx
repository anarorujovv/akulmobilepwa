import React, { useEffect, useState } from 'react';
import { SpinLoading, FloatingBubble, Divider } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import { useNavigate } from 'react-router-dom';

const InventoryList = () => {
    const navigate = useNavigate();
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

    const fetchingDocumentData = async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') };
        obj.pg = obj.pg - 1;

        await api('inventories/get.php', obj)
            .then((element) => {
                if (element != null) {
                    setItemSize(element.Count);
                    if (filter.agrigate == 1) {
                        setDocumentsInfo(element);
                    }
                    setDocuments(element.List[0] ? [...element.List] : []);
                }
            })
            .catch((err) => {
                ErrorMessage(err);
            })
            .finally(() => {
                setIsRefreshing(false);
            });
    };

    const handleDelete = async (id) => {
        if (permission_ver(permissions, 'inventory', 'D')) {
            await api('inventories/del.php?id=' + id, {
                token: await AsyncStorageWrapper.getItem('token')
            }).then(element => {
                if (element != null) {
                    setDocuments([]);
                    fetchingDocumentData();
                }
            }).catch(err => {
                ErrorMessage(err);
            });
        } else {
            ErrorMessage("İcazə yoxdur!");
        }
    };

    const FooterComponent = () => {
        return documents.length === 20 || filter.pg !== 1 ? (
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
        ) : null;
    };

    const renderItem = (item, index) => (
        <React.Fragment key={item.Id}>
            <ListItem
                onLongPress={() => {
                    if (window.confirm('Alış silməyə əminsiniz?')) {
                        handleDelete(item.Id);
                    }
                }}
                firstText={item.Name}
                centerText={item.Moment}
                priceText={formatPrice(item.Amount)}
                endText={item.StockName}
                notIcon={true}
                onPress={() => {
                    if (permission_ver(permissions, 'inventory', 'R')) {
                        navigate('/inventory/inventory-manage', {
                            state: { id: item.Id }
                        });
                    } else {
                        ErrorMessage('İcazəniz yoxdur!');
                    }
                }}
                index={index + 1}
            />
        </React.Fragment>
    );

    useEffect(() => {
        setDocuments(null);
        let time = setTimeout(() => {
            fetchingDocumentData();
        }, 300);

        return () => clearTimeout(time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleFabClick = () => {
        if (permission_ver(permissions, 'inventory', 'C')) {
            navigate('/inventory/inventory-manage', {
                state: { id: null }
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--adm-color-background)',
            overflow: 'hidden'
        }}>
            <ListPagesHeader
                isSearch={true}
                header={'İnventarlar'}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isFilter={true}
                filterParams={{
                    searchParams: [
                        'product',
                        'stocks',
                        'owners',
                        'documentName'
                    ],
                    sortList: [
                        { id: '1', label: 'Tarix', value: "Moment" },
                        { id: '2', label: 'Anbar', value: 'StockName' },
                        { id: '3', label: "Məbləğə görə", value: 'Amount' },
                        { id: '4', label: 'Status', value: "Mark" }
                    ]
                }}
            />

            <DocumentTimes
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            {documentsInfo ? (
                <DocumentInfo
                    data={[
                        {
                            title: "Məbləğ",
                            value: formatPrice(documentsInfo.AllSum)
                        }
                    ]}
                />
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--adm-color-border)'
                }}>
                    <SpinLoading color='primary' style={{ '--size': '20px' }} />
                </div>
            )}

            {documents === null ? (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <SpinLoading color='primary' style={{ '--size': '40px' }} />
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingBottom: 80,
                    padding: '0 12px 80px 12px'
                }}>
                    {documents.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: 'var(--adm-color-weak)'
                        }}>
                            List boşdur
                        </div>
                    ) : (
                        <>
                            {documents.map((item, index) => renderItem(item, index))}
                            <FooterComponent />
                        </>
                    )}
                </div>
            )}

            <FloatingBubble
                style={{
                    '--initial-position-bottom': '24px',
                    '--initial-position-right': '24px',
                    '--edge-distance': '24px',
                    '--background': 'var(--adm-color-primary)',
                    '--size': '56px'
                }}
                onClick={handleFabClick}
            >
                <AddOutline fontSize={28} color='#fff' />
            </FloatingBubble>
        </div>
    );
};

export default InventoryList;
