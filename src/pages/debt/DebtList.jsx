import React, { useCallback, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
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
    let theme = useTheme();

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
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        emptyContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 50
        },
        picker: {
            width: '100%',
            padding: 10,
            backgroundColor: theme.bg,
            color: theme.black,
            border: 'none',
            fontSize: 16,
            outline: 'none',
            cursor: 'pointer'
        }
    };

    const fetchingDocumentData = async () => {
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
            });
    };

    useEffect(() => {
        setDocuments(null);
        let time = setTimeout(() => {
            fetchingDocumentData();
        }, 300);
        return () => clearTimeout(time);
    }, [filter]);

    useEffect(() => {
        if (location.state?.appliedFilter) {
            setFilter(location.state.appliedFilter);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    return (
        <div style={styles.container}>
            <ListPagesHeader
                header={"Borclar"}
                filter={filter}
                setFilter={setFilter}
                isSearch={true}
                filterSearchKey={'docNumber'}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
                            searchParams: [
                                'customers',
                                'customerGroups',
                                'owners',
                                'departments'
                            ]
                        }
                    });
                }}
            />

            <select
                style={styles.picker}
                value={filter.zeros}
                onChange={(e) => {
                    let val = e.target.value;
                    let filterData = { ...filter };
                    filterData.pg = 1;
                    filterData.agrigate = 1;
                    filterData.zeros = val;
                    setFilter(filterData);
                }}
            >
                {selectionData.map((element) => (
                    <option key={element.value} value={element.value}>{element.name}</option>
                ))}
            </select>

            {documents == null ? (
                <div style={styles.loadingContainer}>
                    <div className="spinner"></div> // Assuming global spinner class
                </div>
            ) : (
                <div style={styles.listContainer}>
                    <DocumentInfo
                        data={[
                            { title: "Alacaq", value: formatPrice(documentsInfo.AllInSum) },
                            { title: "Verəcək", value: formatPrice(documentsInfo.AllOutSum) },
                            { title: 'Borclar (ümumi)', value: formatPrice(documentsInfo.AllSum) }
                        ]}
                    />

                    {documents.length === 0 ? (
                        <div style={styles.emptyContainer}>
                            <span style={{ color: theme.text }}>List boşdur</span>
                        </div>
                    ) : (
                        <>
                            {documents.map((item, index) => (
                                <div key={item.CustomerId}>
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
                                </div>
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
