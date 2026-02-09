import React, { useEffect, useState, useCallback } from 'react';
import { SpinLoading, CapsuleTabs } from 'antd-mobile';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import { formatPrice } from '../../services/formatPrice';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import ListItem from '../../shared/ui/list/ListItem';
import { useNavigate } from 'react-router-dom';

const StockBalanceList = () => {
    const navigate = useNavigate();

    let selectionData = [
        { label: "Hamısı", value: "all" },
        { label: "Müsbətlər", value: "1" },
        { label: "Mənfilər", value: "2" },
        { label: "0 olmayanlar", value: "3" },
        { label: "0 olanlar", value: "4" }
    ];

    const [stocks, setStocks] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [itemSize, setItemSize] = useState(0);
    const [stockInfo, setStockInfo] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    let [filter, setFilter] = useState({
        pg: 1,
        lm: 100,
        dr: 0,
        sr: "ProductName",
        zeros: 3,
        ar: 0,
        showc: true,
        showh: false,
        quick: "",
        agrigate: 1
    });

    const fetchingStockBalance = useCallback(async () => {
        setIsRefreshing(true);
        let obj = { ...filter };
        obj.pg = obj.pg - 1;
        obj.token = await AsyncStorageWrapper.getItem("token");

        if (obj.zeros == "all") {
            obj.zeros = "";
        }

        try {
            const element = await api('stockbalance/get.php', obj);
            if (element != null) {
                setItemSize(element.Count);
                if (filter.agrigate == 1) {
                    setStockInfo(element);
                }
                setStocks([...element.List]);
            }
        } catch (err) {
            ErrorMessage(err);
        } finally {
            setIsRefreshing(false);
        }
    }, [filter]);

    useEffect(() => {
        setStocks([]); // clear list on filter change
        let time = setTimeout(() => {
            fetchingStockBalance();
        }, 300);

        return () => clearTimeout(time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleScanner = () => {
        navigate('/product-scanner', {
            state: {
                returnPath: '/stockbalance',
            }
        });
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
                processScannerClick={handleScanner}
                header={"Anbar qalığı"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'quick'}
                isSearch={true}
                isFilter={true}
                filterParams={{
                    searchParams: [
                        'product',
                        'groups',
                        'stocks',
                        'customers',
                    ],
                    customFields: {
                        groups: {
                            title: "Qrup",
                            name: 'gp',
                            type: 'select',
                            api: 'productfolders'
                        },
                        product: {
                            title: "Məhsul",
                            name: 'nmId',
                            type: 'select',
                            api: "products",
                            searchApi: 'products/getfast.php',
                            searchKey: 'fast'
                        }
                    },
                    sortList: [
                        { id: 1, label: "Məhsulun adı", value: 'ProductName' },
                        { id: 2, label: 'Barkod', value: 'BarCode' },
                        { id: 3, label: 'Ümumi qalığ', value: "Quantity" },
                        { id: 4, label: 'Alış qiyməti', value: 'BuyPrice' },
                        { id: 5, label: 'Satış qiyməti', value: 'Price' },
                        { id: 6, label: 'Cəm satış', value: 'SumSalePrice' }
                    ]
                }}
            />

            <div style={{ padding: '0 12px', marginTop: 10 }}>
                <CapsuleTabs
                    activeKey={filter.zeros.toString()}
                    onChange={(key) => {
                        let filterData = { ...filter };
                        filterData.zeros = key;
                        filterData.pg = 1;
                        filterData.agrigate = 1;
                        setFilter(filterData);
                    }}
                >
                    {selectionData.map(element => (
                        <CapsuleTabs.Tab title={element.label} key={element.value} />
                    ))}
                </CapsuleTabs>
            </div>

            {stockInfo != null ? (
                <DocumentInfo
                    data={[
                        { title: "Ümumi qalıq", value: formatPrice(stockInfo.QuantitySum) },
                        { title: "Maya", value: formatPrice(stockInfo.CostSum) },
                        { title: "Cəm Satış", value: formatPrice(stockInfo.SaleSum) }
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

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 12px 0 12px'
            }}>
                {stocks == null || stocks.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        {stocks == null ? (
                            <SpinLoading color='primary' style={{ '--size': '40px' }} />
                        ) : (
                            <span style={{ color: 'var(--adm-color-weak)' }}>List boşdur</span>
                        )}
                    </div>
                ) : (
                    <>
                        {stocks.map((item, index) => (
                            <React.Fragment key={item.ProductId}>
                                <ListItem
                                    onPress={() => {
                                        navigate("/stockbalance/stock-manage", {
                                            state: {
                                                id: item.ProductId,
                                                name: item.ProductName
                                            }
                                        });
                                    }}
                                    firstText={item.GroupName}
                                    centerText={item.ProductName}
                                    endText={formatPrice(item.Quantity)}
                                    priceText={formatPrice(item.Price)}
                                    index={index + 1}
                                />
                            </React.Fragment>
                        ))}
                        {(stocks.length === 100 || filter.pg !== 0) && (
                            <MyPagination
                                itemSize={itemSize}
                                page={filter.pg + 1}
                                setPage={(e) => {
                                    let filterData = { ...filter };
                                    filterData.agrigate = 0;
                                    filterData.pg = e - 1;
                                    setStocks([]);
                                    setFilter(filterData);
                                }}
                                pageSize={21000} // Preserving original page size logic
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StockBalanceList;
