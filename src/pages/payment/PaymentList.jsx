import React, { useEffect, useState, useCallback } from 'react';
import { SpinLoading, FloatingBubble, ActionSheet, CapsuleTabs } from 'antd-mobile';
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
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let permissions = useGlobalStore(state => state.permissions);

    const [selectedTime, setSelectedTime] = useState(4);
    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [actionSheetVisible, setActionSheetVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [itemSize, setItemSize] = useState(0);
    const [filter, setFilter] = useState({
        dr: 1,
        sr: "Moment",
        pg: 1,
        lm: 20,
        agrigate: 1,
        advance: "hide",
        paydir: "all"
    });

    let selectionData = [
        { name: "Mədaxil", value: "i" },
        { name: "Məxaric", value: "o" },
        { name: "Hamısı", value: "all" }
    ];

    const fetchingDocumentData = useCallback(async () => {
        setIsRefreshing(true);
        let obj = {
            ...filter,
            pg: filter.pg - 1,
            token: await AsyncStorageWrapper.getItem('token'),
            paydir: filter.paydir.replace("all", "")
        };
        try {
            const element = await api('transactions/get.php', obj);
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

    const handleDelete = async (id, item) => {
        let url = `${item.Type == "p" ? "payment" : "invoice"}${item.Direct == "i" ? "ins" : "outs"}`;
        if (permission_ver(permissions, 'page_payments', 'D')) {
            await api(`${url}/del.php?id=` + id, {
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

    const handleDocumentCreate = (type, cost) => {
        setActionSheetVisible(false);
        let obj = {
            id: null,
            direct: type,
            type: "payment"
        };

        if (cost) {
            obj.cost = true;
        }

        navigate('/payment/payment-manage', { state: obj });
    };

    const actions = [
        { text: 'Mədaxil', key: 'ins', onClick: () => handleDocumentCreate('ins') },
        { text: 'Məxaric', key: 'outs', onClick: () => handleDocumentCreate('outs') },
        { text: 'Xərc', key: 'cost', onClick: () => handleDocumentCreate('outs', true) },
    ];

    useEffect(() => {
        setDocuments([]);
        let time = setTimeout(() => {
            fetchingDocumentData();
        }, 300);
        return () => clearTimeout(time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        if (location.state?.appliedFilter) {
            setFilter(location.state.appliedFilter);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const renderItem = (item, index) => (
        <React.Fragment key={item.Id}>
            <ListItem
                deactiveStatus={item.Status == 0}
                index={index + 1}
                onLongPress={() => {
                    if (window.confirm('Ödənişi silməyə əminsiniz?')) {
                        handleDelete(item.Id, item);
                    }
                }}
                markId={item.Mark}
                centerText={item.CustomerName}
                firstText={`${item.TypeName} - ${item.Moment}`}
                endText={item.SpendName != null && <span style={{ color: 'var(--adm-color-weak)' }}>{item.SpendName}</span>}
                notIcon={true}
                priceText={formatPrice(item.Amount)}
                onPress={() => {
                    if (permission_ver(permissions, 'page_payments', 'R')) {
                        let obj = {
                            id: item.Id,
                            type: item.Type === "i" ? "invoice" : "payment",
                            direct: item.Direct === "i" ? "ins" : "outs"
                        };
                        navigate('/payment/payment-manage', { state: obj });
                    } else {
                        ErrorMessage('İcazəniz yoxdur!');
                    }
                }}
            />
        </React.Fragment>
    )

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--adm-color-background)',
            overflow: 'hidden'
        }}>
            <ListPagesHeader
                header={"Ödənişlər"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isSearch={true}
                isFilter={true}
                filterParams={{
                    searchParams: [
                        'documentName',
                        'spendItems',
                        'customers',
                        'cashes',
                        'customerGroups'
                    ],
                    sortList: [
                        { id: 1, label: "Ad", value: 'Name' },
                        { id: 2, label: "Tarix", value: "Moment" },
                        { id: 3, label: 'Tərəf-Müqabil', value: 'CustomerName' },
                        { id: 4, label: 'Hesab', value: 'CashName' },
                        { id: 5, label: "Xərc-Maddəsi", value: 'SpendName' }
                    ]
                }}
            />

            <div style={{ padding: '0 12px', marginTop: 10 }}>
                <CapsuleTabs
                    activeKey={filter.paydir}
                    onChange={(key) => {
                        let filterData = { ...filter };
                        filterData.pg = 1;
                        filterData.agrigate = 1;
                        filterData.paydir = key;
                        setFilter(filterData);
                    }}
                >
                    {selectionData.map((element) => (
                        <CapsuleTabs.Tab title={element.name} key={element.value} />
                    ))}
                </CapsuleTabs>
            </div>


            <DocumentTimes
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            <div style={{ width: '100%' }}>
                {documentsInfo != null ? (
                    <DocumentInfo
                        data={[
                            { title: "Mədaxil", value: formatPrice(documentsInfo.InSum) },
                            { title: "Məxaric", value: formatPrice(documentsInfo.OutSum) }
                        ]}
                    />
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0', borderBottom: '1px solid var(--adm-color-border)' }}>
                        <SpinLoading color='primary' style={{ '--size': '20px' }} />
                    </div>
                )}
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingBottom: 80,
                padding: '0 12px 80px 12px'
            }}>
                {documents == null ? (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <SpinLoading color='primary' style={{ '--size': '40px' }} />
                    </div>
                ) : (
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
                            <>
                                {documents.map((item, index) => renderItem(item, index))}
                                {(documents.length === 20 || filter.pg !== 1) && (
                                    <MyPagination
                                        itemSize={itemSize}
                                        page={filter.pg}
                                        setPage={(e) => {
                                            let filterData = { ...filter };
                                            filterData.agrigate = 0;
                                            filterData.pg = e;
                                            setDocuments([]);
                                            setFilter(filterData);
                                        }}
                                        pageSize={20}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
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
                    if (permission_ver(permissions, 'page_payments', 'C')) {
                        setActionSheetVisible(true);
                    }
                }}
            >
                <AddOutline fontSize={28} color='#fff' />
            </FloatingBubble>

            <ActionSheet
                visible={actionSheetVisible}
                actions={actions}
                onClose={() => setActionSheetVisible(false)}
            />
        </div>
    );
};

export default PaymentList;
