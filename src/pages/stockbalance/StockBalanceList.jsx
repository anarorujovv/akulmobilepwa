import React, { useEffect, useState, useCallback } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import MyPagination from '../../shared/ui/MyPagination';
import { formatPrice } from '../../services/formatPrice';
import Line from '../../shared/ui/Line';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import ListItem from '../../shared/ui/list/ListItem';
import { useNavigate } from 'react-router-dom';

const StockBalanceList = () => {
    const navigate = useNavigate();
    let theme = useTheme();

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
    const [selectedTime, setSelectedTime] = useState(null); // kept for logic consistency, though usage in onRefresh is tricky in web

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
            width: '100%',
            height: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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
        fullLoading: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    };

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
    }, [filter]);

    const handleScanner = () => {
        navigate('/product-scanner', { // Assuming global route
            state: {
                returnPath: '/stockbalance', // Or handle via callback if architecture supports
                // setData not really supported via state strictly, usually use context or URL param
                // For now, assuming scanner updates a global state or we use a different approach.
                // But following the React Native logic: passed callback.
                // React Router doesn't support passing functions in state.
                // We might need a global store for scanner result.
            }
        });
        // Workaround for scanner callback:
        // In a real app, use a Context or Zustand store for 'scannedResult'.
        // For this conversion, I'll assume the scanner might not work fully as intended with callback pattern.
        // But the user mentioned 'product-scanner' navigation issue previously.
        // I will just navigate for now.
    };

    return (
        <div style={styles.container}>
            <ListPagesHeader
                processScannerClick={handleScanner}
                header={"Anbar qalığı"}
                filter={filter}
                setFilter={setFilter}
                filterSearchKey={'quick'}
                isSearch={true}
                isFilter={true}
                processFilterClick={() => {
                    navigate('/filter', {
                        state: {
                            filter: filter,
                            // setFilter: setFilter, // Removing function from state
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
                    filterData.zeros = val;
                    filterData.pg = 1;
                    filterData.agrigate = 1;
                    setFilter(filterData);
                }}
            >
                {selectionData.map(element => (
                    <option key={element.value} value={element.value}>{element.label}</option>
                ))}
            </select>

            <Line width={'100%'} />

            {stockInfo != null ? (
                <DocumentInfo
                    data={[
                        { title: "Ümumi qalıq", value: formatPrice(stockInfo.QuantitySum) },
                        { title: "Maya", value: formatPrice(stockInfo.CostSum) },
                        { title: "Cəm Satış", value: formatPrice(stockInfo.SaleSum) }
                    ]}
                />
            ) : (
                <div style={styles.loadingContainer}>
                    <div className="spinner" style={{ width: 20, height: 20 }}></div>
                    <Line width={'100%'} />
                </div>
            )}

            <div style={styles.listContainer}>
                {stocks == null || stocks.length === 0 ? (
                    <div style={styles.fullLoading}>
                        {stocks == null ? (
                            <div className="spinner"></div> // List loading
                        ) : (
                            <span style={{ color: theme.text }}>List boşdur</span>
                        )}
                    </div>
                ) : (
                    <>
                        {stocks.map((item, index) => (
                            <div key={item.ProductId}>
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
                            </div>
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
                                pageSize={21000} // This seems unusually high page size, checking original... yes 21000.
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StockBalanceList;
