import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import MySelection from '../../shared/ui/MySelection';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import Line from '../../shared/ui/Line';
import CardItem from './../../shared/ui/list/CardItem';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentTimes from '../../shared/ui/DocumentTimes';

const DailyProfits = () => {
    let theme = useTheme();
    const [selectionData, setSelectionData] = useState([]);
    const [info, setInfo] = useState(null);
    const [filter, setFilter] = useState({
        salepointid: 'not'
    });

    let [data, setData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        content: {
            flex: 1,
            padding: 10,
            overflowY: 'auto'
        },
        section: {
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.whiteGrey,
            borderColor: theme.grey,
            borderWidth: 1,
        },
        itemRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '12px 20px',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: `1px solid ${theme.whiteGrey}`
        },
        itemText: {
            color: theme.black,
            fontSize: 13
        },
        selectionContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: 10
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        infoText: {
            textAlign: 'center',
            color: theme.primary,
            fontWeight: 'bold'
        }
    };

    let fetchingData = async () => {
        setInfo(null);

        if (!selectionData[0]) {
            await api('salepoints/get.php', {
                token: await AsyncStorageWrapper.getItem('token')
            })
                .then((element) => {
                    if (element != null) {
                        setSelectionData([...element.List]);
                    }
                }).catch(err => {
                    ErrorMessage(err);
                });
        }

        if (filter.salepointid !== 'not') {
            let obj = {
                ...filter,
                token: await AsyncStorageWrapper.getItem('token')
            };

            await api('dailyreports/salepoints.php', obj)
                .then((item) => {
                    if (item != null) {
                        let list = [
                            {
                                title: 'SATIŞLAR (MƏHSUL)',
                                items: [
                                    { key: 'Məbləğ', value: item.sales_amount || '-' },
                                    { key: 'Nağd', value: item.sales_cash || '-' },
                                    { key: 'Nağdsız', value: item.sales_noncash || '-' },
                                    { key: 'Miqdar', value: item.sales_count || '0' },
                                    { key: 'Bonus', value: item.sales_bonus || '0' },
                                    { key: 'Borca', value: item.sales_credit || '0' }
                                ]
                            },
                            {
                                title: 'QAYTARMALAR',
                                items: [
                                    { key: 'Məbləğ', value: item.returns_amount || '0' },
                                    { key: 'Nağd', value: item.returns_cash || '0' },
                                    { key: 'Nağdsız', value: item.returns_noncash || '0' },
                                    { key: 'Miqdar', value: item.returns_count || '0' },
                                    { key: 'Bonusdan', value: item.returns_bonus || '0' },
                                    { key: 'Borcdan', value: item.returns_credit || '0' }
                                ]
                            },
                            {
                                title: 'ALIŞLAR',
                                items: [
                                    { key: 'Məbləğ', value: item.supplies_amount || '0' },
                                    { key: 'Çeşid', value: item.supplies_product_position_count || '0' }
                                ]
                            },
                            {
                                title: 'MƏDAXİL (SATIŞ NÖQTƏSİNƏ BAĞLI HESAB)',
                                items: [
                                    { key: 'Nağd', value: item.transaction_payment_in || '0' },
                                    { key: 'Köçürmə', value: item.transaction_invoice_in || '0' }
                                ]
                            },
                            {
                                title: 'LİDER MƏHSULLAR',
                                items: [
                                    { key: 'Satışda ən çox təkrarlanan məhsullar', value: item.top_bestseller_products_per_check || '-' },
                                    { key: 'Qaytarmada ən çox təkrarlanan məhsullar', value: item.top_bestreturn_products_per_check || '-' },
                                    { key: 'Ən çox qazanc gətirən məhsullar', value: item.top_profitable_products || '-' }
                                ]
                            },
                            {
                                title: 'ANBAR QALIĞI',
                                items: [
                                    { key: 'Maya', value: item.stock_cost_price || '-' },
                                    { key: 'Cəm satış qiyməti', value: item.stock_sale_price || '-' },
                                    { key: 'Cəm alış qiyməti', value: item.stock_buy_price || '-' },
                                    { key: 'Miqdar', value: item.stock_quantity || '-' },
                                    { key: 'Çeşid', value: item.stock_position_count || '0' }
                                ]
                            },
                        ];
                        setData(list);
                        setInfo({ ...item });
                    } else {
                        setInfo("not");
                    }
                })
                .catch(err => {
                    ErrorMessage(err);
                });
        }
    };

    const changeFilter = (e) => {
        setFilter(rel => ({ ...rel, ['salepointid']: e }));
    };

    useEffect(() => {
        fetchingData();
    }, [filter]);

    return (
        <div style={styles.container}>
            <ListPagesHeader
                header={'Gündəlik hesabat'}
            />

            {filter.salepointid === 'not' ? (
                <div style={styles.content}>
                    {selectionData[0] ? (
                        selectionData.map((item) => (
                            <div key={item.Id}>
                                <div
                                    onClick={() => changeFilter(item.Id)}
                                    style={styles.itemRow}
                                    className="hover-bg" // Assuming a hover class exists or inline hover can be added
                                >
                                    <span style={styles.itemText}>{item.Name}</span>
                                </div>
                                <Line width={'95%'} />
                            </div>
                        ))
                    ) : (
                        <div style={styles.loadingContainer}>
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>
            ) : (
                <div style={styles.content}>
                    <div style={styles.selectionContainer}>
                        {selectionData[0] ? (
                            <MySelection
                                list={selectionData}
                                labelName={'Name'}
                                valueName={'Id'}
                                width={'100%'}
                                value={filter.salepointid}
                                onValueChange={(e) => changeFilter(e)}
                                label={'Satış şöbəsi'}
                            />
                        ) : ""}

                        <DocumentTimes
                            filter={filter}
                            setFilter={setFilter}
                            selected={selectedIndex}
                            setSelected={setSelectedIndex}
                        />

                        {info == null ? (
                            <div style={styles.loadingContainer}>
                                <div className="spinner"></div>
                            </div>
                        ) : info === 'not' ? (
                            <div style={styles.loadingContainer}>
                                <span style={styles.infoText}>Məlumat tapılmadı!</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
                                {data.map((section, index) => (
                                    <CardItem
                                        key={index + 1}
                                        title={section.title}
                                        items={section.items}
                                        valueFormatPrice={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyProfits;
