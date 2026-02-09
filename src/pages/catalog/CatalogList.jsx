import React, { useState, useCallback, useEffect } from 'react';
import { SpinLoading, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from './../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import translatePayed from './../../services/report/translatePayed';
import { useNavigate } from 'react-router-dom';

const CatalogList = () => {
    const navigate = useNavigate();
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

    const fetchingDocumentData = useCallback(async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') }
        obj.pg = obj.pg - 1;

        try {
            const element = await api('catalogs/get.php', obj);
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
        if (permission_ver(permissions, 'catalog', 'D')) {
            await api('catalogs/del.php?id=' + id, {
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

    useEffect(() => {
        setDocuments(null);
        let time = setTimeout(() => {
            fetchingDocumentData();
        }, 300);

        return () => clearTimeout(time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

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
                header={'Kataloglar'}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isFilter={true}
                filterParams={{
                    searchParams: [
                        'product',
                        'stocks',
                        'owners',
                        'documentName',
                        'departments'
                    ],
                    sortList: [
                        { id: '1', label: 'Tarix', value: "Moment" },
                        { id: '2', label: 'Anbar', value: 'StockName' },
                        { id: '3', label: "Məbləğə görə", value: 'Amount' },
                        { id: '4', label: 'Status', value: "Mark" }
                    ],
                    customFields: {
                        product: {
                            title: "Məhsul",
                            api: 'products',
                            name: "productName",
                            type: 'select',
                            searchApi: 'products/getfast.php',
                            searchKey: 'fast'
                        }
                    }
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
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--adm-color-border)'
                }}>
                    <SpinLoading color='primary' style={{ '--size': '20px' }} />
                </div>
            )}

            <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: 80,
                padding: '0 12px 80px 12px'
            }}>
                {
                    documents == null ?
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <SpinLoading color='primary' style={{ '--size': '40px' }} />
                        </div>
                        :
                        <>
                            {documents.length === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    color: 'var(--adm-color-weak)'
                                }}>
                                    <span>List boşdur</span>
                                </div>
                            ) : (
                                documents.map((item, index) => (
                                    <React.Fragment key={item.Id}>
                                        <ListItem
                                            index={index + 1}
                                            onLongPress={() => {
                                                if (window.confirm('Kataloqu silməyə əminsiniz?')) {
                                                    handleDelete(item.Id);
                                                }
                                            }}
                                            {...translatePayed(item.Payed)}
                                            markId={item.Mark}
                                            centerText={item.OwnerName}
                                            firstText={item.Name}
                                            endText={item.Moment}
                                            notIcon={true}
                                            priceText={formatPrice(item.Amount)}
                                            onPress={() => {
                                                if (permission_ver(permissions, 'catalog', 'R')) {
                                                    navigate('/catalog/catalog-manage', {
                                                        state: { id: item.Id }
                                                    })
                                                } else {
                                                    ErrorMessage('İcazəniz yoxdur!')
                                                }
                                            }}
                                        />
                                    </React.Fragment>
                                ))
                            )}
                            <RenderFooter />
                        </>
                }
            </div>

            <FloatingBubble
                style={{
                    '--initial-position-bottom': '24px',
                    '--initial-position-right': '24px',
                    '--edge-distance': '24px',
                    '--background': 'var(--adm-color-primary)',
                    '--size': '56px'
                }}
                onClick={() => {
                    if (permission_ver(permissions, 'catalog', 'C')) {
                        navigate('/catalog/catalog-manage', {
                            state: { id: null }
                        })
                    }
                }}
            >
                <AddOutline fontSize={28} color='#fff' />
            </FloatingBubble>
        </div>
    )
}

export default CatalogList;
