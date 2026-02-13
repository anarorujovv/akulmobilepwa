import React, { useContext } from 'react';
import { Card } from 'antd-mobile';
import { IoPerson } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import { SupplyGlobalContext } from '../../../shared/data/SupplyGlobalState';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../../services/formatPrice';
import applyDiscount from '../../../services/report/applyDiscount';
import pricingUtils from '../../../services/pricingUtils';
import mergeProductQuantities from '../../../services/mergeProductQuantities';
import Selection from '../../../shared/ui/Selection';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';

const BuyerCard = ({ changeSelection }) => {

    const { document, setDocument } = useContext(SupplyGlobalContext);
    const local = useGlobalStore(state => state.local);
    const theme = useTheme();

    if (!document) return null;

    const styles = {
        header: {
            width: '100%',
            padding: 15,
            gap: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        },
        container: {
            gap: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    };

    const fetchingCustomerData = async (item) => {
        let info = { ...document };

        let obj = {
            id: item.Id,
            token: await AsyncStorageWrapper.getItem("token")
        }

        await api("customers/getdata.php", obj)
            .then(element => {
                if (element != null) {
                    let customer = { ...element }
                    customer.CustomerData.Discount = formatPrice(customer.CustomerData.Discount);
                    info.CustomerInfo = customer;
                    info.CustomerId = item.Id;

                    if (info.Positions[0]) {
                        let positions = [...info.Positions];
                        for (let index = 0; index < positions.length; index++) {
                            positions[index].Price = applyDiscount(positions[index].BasicPrice, customer.CustomerData.Discount)
                            positions[index].Discount = customer.CustomerData.Discount
                        }
                        info.Positions = positions;
                    }
                }

                changeSelection();
                setDocument({ ...info, ...(pricingUtils(info.Positions)) });

            })
            .catch(err => {
                ErrorMessage(err);
            })
    }

    const fetchingStockData = async (item) => {
        let result = await mergeProductQuantities(document, item.Id);
        changeSelection();
        setDocument(result);
    }


    return (
        <Card
            title={
                <div style={styles.header}>
                    <IoPerson size={20} color={theme.grey} />
                    <span style={{ color: theme.grey }}>Qarşı-Tərəf</span>
                </div>
            }
        >
            <div style={styles.container}>
                <Selection
                    isRequired={true}
                    apiName={'customers/getfast.php'}
                    apiBody={{}}
                    searchApi={'customers/getfast.php'}
                    searchKey={'fast'}
                    change={fetchingCustomerData}
                    value={document.CustomerId}
                    defaultValue={document.CustomerName}
                    title={'Qarşı-Tərəf'}
                    bottomText={local?.supplies?.supply?.customerDebt ? document.CustomerInfo != undefined ? formatPrice(document.CustomerInfo.Debt) : '0' : ""}
                    bottomTitle={'Qarşı-tərəf'}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        padding: '0 10px'
                    }}
                >
                    <span style={{ fontSize: 12, color: theme.orange }}>{'Müştəri endirimi'}</span>
                    <span style={{ fontSize: 12, color: theme.black }}>{document.CustomerInfo != undefined ? formatPrice(document.CustomerInfo.CustomerData.Discount) : '0'} %</span>
                </div>

                <Selection
                    isRequired={true}
                    apiBody={{}}
                    apiName={'stocks/get.php'}
                    change={fetchingStockData}
                    defaultValue={document.StockName}
                    value={document.StockId}
                    title={'Anbar'}
                />

            </div>
        </Card >
    )
}

export default BuyerCard;
