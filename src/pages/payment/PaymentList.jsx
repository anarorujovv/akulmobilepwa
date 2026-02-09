import React, { useEffect, useState, useCallback } from 'react';
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
import Line from '../../shared/ui/Line';
import { useNavigate, useLocation } from 'react-router-dom';
import MyModal from '../../shared/ui/MyModal';
import { MdInsertDriveFile } from 'react-icons/md';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';

const PaymentList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let theme = useTheme();

    let permissions = useGlobalStore(state => state.permissions);

    const [selectedTime, setSelectedTime] = useState(4);
    const [documents, setDocuments] = useState([]);
    const [documentsInfo, setDocumentsInfo] = useState(null);
    const [selectionModal, setSelectionModal] = useState(false);
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
            overflowY: 'auto',
            paddingBottom: 80
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
        modalHeader: {
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            padding: 15,
            width: '100%',
            alignItems: 'center',
            backgroundColor: theme.primary,
        },
        modalHeaderText: {
            color: theme.whiteGrey,
            fontWeight: 'bold'
        },
        itemContainer: {
            width: '100%',
            paddingLeft: 50,
            height: 50,
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
            display: 'flex',
            flexDirection: 'row',
            cursor: 'pointer',
            borderBottom: `1px solid ${theme.whiteGrey}`
        },
        itemText: {
            color: theme.black,
            fontSize: 18,
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
        },
    };

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
        setSelectionModal(false);
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

    useEffect(() => {
        setDocuments([]);
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
                header={"Ödənişlər"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
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
                        }
                    });
                }}
            />

            <select
                style={styles.picker}
                value={filter.paydir}
                onChange={(e) => {
                    let val = e.target.value;
                    let filterData = { ...filter };
                    filterData.pg = 1;
                    filterData.agrigate = 1;
                    filterData.paydir = val;
                    setFilter(filterData);
                }}
            >
                {selectionData.map((element) => (
                    <option key={element.value} value={element.value}>{element.name}</option>
                ))}
            </select>

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
                    <div style={{ width: '100%', height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="spinner" style={{ width: 15, height: 15 }}></div>
                        <Line width={'100%'} />
                    </div>
                )}
            </div>

            {documents == null ? (
                <div style={styles.loadingContainer}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <div style={styles.listContainer}>
                    {documents.length === 0 ? (
                        <div style={styles.emptyContainer}>
                            <span style={{ color: theme.text }}>List boşdur</span>
                        </div>
                    ) : (
                        <>
                            {documents.map((item, index) => (
                                <div key={item.Id}>
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
                                        endText={item.SpendName != null && <span style={{ color: theme.button.disabled }}>{item.SpendName}</span>}
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
                                </div>
                            ))}
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
                </div>
            )}

            <FabButton
                onPress={() => {
                    if (permission_ver(permissions, 'page_payments', 'C')) {
                        setSelectionModal(true);
                    }
                }}
            />

            <MyModal
                modalVisible={selectionModal}
                setModalVisible={setSelectionModal}
                width={'300px'}
                height={'auto'}
                center={true}
            >
                <div style={styles.modalHeader}>
                    <MdInsertDriveFile color={theme.whiteGrey} size={25} />
                    <span style={styles.modalHeaderText}>Sənəd yaradın</span>
                </div>

                <div
                    onClick={() => {
                        handleDocumentCreate('ins');
                    }}
                    style={styles.itemContainer}
                >
                    <AiOutlinePlusCircle size={20} color={theme.primary} />
                    <span style={styles.itemText}>Mədaxil</span>
                </div>

                <div
                    onClick={() => {
                        handleDocumentCreate('outs');
                    }}
                    style={styles.itemContainer}
                >
                    <AiOutlineMinusCircle size={20} color={theme.primary} />
                    <span style={styles.itemText}>Məxaric</span>
                </div>

                <div
                    onClick={() => {
                        handleDocumentCreate('outs', true);
                    }}
                    style={styles.itemContainer}
                >
                    <AiOutlineMinusCircle size={20} color={theme.primary} />
                    <span style={styles.itemText}>Xərc</span>
                </div>
            </MyModal>
        </div>
    );
};

export default PaymentList;
