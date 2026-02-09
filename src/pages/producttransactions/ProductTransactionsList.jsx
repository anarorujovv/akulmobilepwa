import React, { useCallback, useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import { formatPrice } from '../../services/formatPrice';
import DocumentTimes from './../../shared/ui/DocumentTimes';
import moment from 'moment';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import CardItem from '../../shared/ui/list/CardItem';
import { useNavigate } from 'react-router-dom';

const ProductTransactionsList = () => {
    const navigate = useNavigate();
    let theme = useTheme();

    const [selectedTime, setSelectedTime] = useState(4);
    const [filter, setFilter] = useState({
        dr: 0,
        sr: "Profit",
        pg: 1,
        gp: null,
        zeros: null,
        ar: null,
        lm: 100,
        own: null,
        showc: null,
        showh: null,
        pricetype: null,
        quick: null,
        docNumber: "",
        agrigate: 1,
        mome: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
        momb: moment(new Date()).format('YYYY-MM-DD 00:00:00')
    })

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
            overflowY: 'auto',
            padding: 10
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            paddingTop: 50
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        section: {
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.stable.white,
            borderColor: theme.grey,
            borderWidth: 1,
            marginLeft: 10,
            marginRight: 10,
        },
        sectionTitle: {
            backgroundColor: theme.primary,
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.bg,
        },
        dateRangeContainer: {
            width: '100%',
            padding: 10
        }
    };

    const fetchingDocumentData = async () => {
        setIsRefreshing(true);
        let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') }
        obj.pg = obj.pg - 1;

        try {
            const element = await api('turnovers/get.php', obj);
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
    }


    const RenderFooter = () => {
        return (
            documents.length == 100 || filter.pg != 1 ?
                <MyPagination
                    pageSize={100}
                    page={filter.pg}
                    setPage={(e) => {
                        let filterData = { ...filter };
                        filterData.agrigate = 0;
                        filterData.pg = e;
                        setFilter(filterData);
                    }}
                    itemSize={itemSize}
                />
                : ""
        )
    }

    useEffect(() => {
        setDocuments(null);
        let time = setTimeout(() => {
            fetchingDocumentData();
        }, 300);

        return () => clearTimeout(time);

    }, [filter])

    const renderItem = (item) => (
        <div key={item.Id || Math.random()}>
            <CardItem
                title={item.ProductName}
                valueFormatPrice={true}
                items={[
                    {
                        key: "Anbar qalığı(ilk)",
                        value: `${formatPrice(item.StartQuantity)} əd x ${formatPrice(item.StartCost)}₼`
                    },
                    {
                        key: 'Alınıb',
                        value: `${formatPrice(item.IncomeQuantity)} əd x ${formatPrice(item.IncomeCost)}₼`
                    },
                    {
                        key: 'Verilib',
                        value: `${formatPrice(item.OutcomeQuantity)} əd x ${formatPrice(item.OutcomeCost)}₼`
                    },
                    {
                        key: 'Anbar qalığı(Son)',
                        value: `${formatPrice(item.EndQuantity)} əd x ${formatPrice(item.EndCost)}₼`
                    }
                ]}
            />
        </div>
    );

    return (
        <div style={styles.container}>

            <ListPagesHeader
                header={"Dövriyyə"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'docNumber'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
                            // setFilter:setFilter,
                            searchParams: [
                                'groups',
                                'product',
                                'stocks',
                                'customers',
                                'owners'
                            ],
                            customFields: {
                                groups: {
                                    title: "Məhsul qrupu",
                                    name: 'gp',
                                    type: 'select',
                                    api: 'productfolders'
                                }
                            }
                        }
                    })
                }}
            />

            <div style={styles.dateRangeContainer}>
                <DateRangePicker
                    submit={true}
                    width={'100%'}
                    filter={filter}
                    setFilter={setFilter}
                />
            </div>

            <DocumentTimes
                selected={selectedTime}
                setSelected={setSelectedTime}
                filter={filter}
                setFilter={setFilter}
            />

            {documents == null ? (
                <div style={styles.loadingContainer}>
                    <div className="spinner"></div> // Web spinner
                </div>
            ) : (
                <div style={styles.listContainer}>
                    {documents.length === 0 ? (
                        <div style={styles.emptyContainer}>
                            <span style={{ color: theme.text }}>List boşdur</span>
                        </div>
                    ) : (
                        documents.map((item) => renderItem(item))
                    )}
                    <RenderFooter />
                </div>
            )}
        </div>
    );
};

export default ProductTransactionsList;
