import React, { useCallback, useEffect, useState } from 'react';
import { SpinLoading, CapsuleTabs } from 'antd-mobile';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import ListItem from '../../shared/ui/list/ListItem';
import { useNavigate, useLocation } from 'react-router-dom';

const DebtList = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let permissions = useGlobalStore(state => state.permissions);

    const [documents, setDocuments] = useState(null);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [filter, setFilter] = useState({
        dr: 0,
        sr: "CustomerName",
        pg: 1,
        gp: "",
        lm: 100,
        zeros: 3,
        ar: 0,
    });
    const [itemSize, setItemSize] = useState(0);
    const selectionData = [
        { name: '0 olanlar', value: '4' },
        { name: '0 olmayanlar', value: '3' },
        { name: 'Borc (verəcək)', value: '2' },
        { name: 'Borc (alacaq)', value: '1' },
        { name: 'Bütün borclar', value: 'all' }
    ];

    const fetchingDocumentData = async () => {
        setIsRefreshing(true);
        let obj = {
            ...filter,
            pg: filter.pg - 1,
            zeros: filter.zeros == 'all' ? '' : filter.zeros,
            token: await AsyncStorageWrapper.getItem('token')
        };
        await api('settlements/get.php', obj)
            .then((element) => {
                if (element != null) {
                    setItemSize(element.Count);
                    setDocumentsInfo(element);
                    setDocuments([...element.List]);
                }
            })
            .catch((err) => {
                ErrorMessage(err);
            })
            .finally(() => {
                setIsRefreshing(false);
            });
    };

    useEffect(() => {
        setDocuments(null);
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

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--adm-color-background)',
            overflow: 'hidden'
        }}>
            <ListPagesHeader
                header={"Borclar"}
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'docNumber'}
                isFilter={true}
                filterParams={{
                    searchParams: [
                        'customers',
                        'customerGroups',
                        'owners',
                        'departments'
                    ]
                }}
            />

            <div style={{ padding: '0 12px', marginTop: 10 }}>
                <CapsuleTabs
                    activeKey={filter.zeros.toString()}
                    onChange={(key) => {
                        let filterData = { ...filter };
                        filterData.pg = 1;
                        filterData.agrigate = 1;
                        filterData.zeros = key;
                        setFilter(filterData);
                    }}
                >
                    {selectionData.map((element) => (
                        <CapsuleTabs.Tab title={element.name} key={element.value} />
                    ))}
                </CapsuleTabs>
            </div>

            {documents == null ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <SpinLoading color='primary' style={{ '--size': '40px' }} />
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0 12px 0 12px'
                }}>
                    <DocumentInfo
                        data={[
                            { title: "Alacaq", value: formatPrice(documentsInfo.AllInSum) },
                            { title: "Verəcək", value: formatPrice(documentsInfo.AllOutSum) },
                            { title: 'Borclar (ümumi)', value: formatPrice(documentsInfo.AllSum) }
                        ]}
                    />

                    {documents.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: 'var(--adm-color-weak)',
                            paddingTop: 50
                        }}>
                            <span>List boşdur</span>
                        </div>
                    ) : (
                        <>
                            {documents.map((item, index) => (
                                <React.Fragment key={item.CustomerId}>
                                    <ListItem
                                        index={index + 1}
                                        centerText={item.CustomerName}
                                        priceText={formatPrice(item.Amount)}
                                        onPress={() => {
                                            if (permission_ver(permissions, 'page_debts', 'R')) {
                                                navigate('/debt/debt-manage', {
                                                    state: { id: item.CustomerId }
                                                });
                                            } else {
                                                ErrorMessage('İcazəniz yoxdur!');
                                            }
                                        }}
                                    />
                                </React.Fragment>
                            ))}
                            <MyPagination
                                pageSize={100}
                                itemSize={itemSize}
                                page={filter.pg}
                                setPage={(e) => {
                                    setFilter(rel => ({ ...rel, ['pg']: e }));
                                }}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DebtList;
