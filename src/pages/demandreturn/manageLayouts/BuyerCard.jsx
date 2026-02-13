import React, { useContext } from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import { IoPerson } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../../services/formatPrice';
import applyDiscount from '../../../services/report/applyDiscount';
import pricingUtils from '../../../services/pricingUtils';
import { DemandReturnGlobalContext } from '../../../shared/data/DemandReturnGlobalState';
import Selection from '../../../shared/ui/Selection';
import mergeProductQuantities from '../../../services/mergeProductQuantities';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';

const BuyerCard = ({ changeInput, changeSelection }) => {

    const { document, setDocument } = useContext(DemandReturnGlobalContext);
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
            alignItems: 'center',
            boxSizing: 'border-box'
        },
        container: {
            gap: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 15px 15px 15px',
            boxSizing: 'border-box'
        }
    };

    const fetchingCustomerData = async (item) => {
        let info = { ...document };

        let obj = {
            id: item.Id,
            token: await AsyncStorageWrapper.getItem("token")
        }
        await api("customers/getdata.php", obj)
            .then(async element => {
                if (element != null) {
                    let customer = { ...element }
                    customer.CustomerData.Discount = formatPrice(customer.CustomerData.Discount);
                    info.CustomerInfo = customer;
                    info.CustomerId = item.Id;

                    if (customer.CustomerData.PriceTypeId != 0 && info.Positions[0]) {
                        let positions = [...info.Positions];
                        let obj = {
                            pricetype: customer.CustomerData.PriceTypeId,
                            products: positions.map(item => item.ProductId),
                            token: await AsyncStorageWrapper.getItem('token')
                        }
                        await api('/products/getproductsrate.php', obj).then(element => {
                            if (element != null) {
                                let list = element.List;
                                for (let index = 0; index < list.length; index++) {
                                    let product = positions.find(item => item.ProductId == list[index].ProductId);
                                    if (product) {
                                        product.Price = formatPrice(list[index].Price);
                                        product.BasicPrice = formatPrice(list[index].Price);
                                    }
                                }
                            }
                        })

                        info.Positions = positions;
                    }

                    if (info.Positions[0]) {

                        let positions = [...info.Positions];
                        for (let index = 0; index < positions.length; index++) {
                            positions[index].Price = applyDiscount(positions[index].BasicPrice, customer.CustomerData.Discount)
                            positions[index].Discount = customer.CustomerData.Discount
                        }

                        info.Positions = positions;
                    }


                }

                setDocument({ ...info, ...(pricingUtils(info.Positions)) });
                changeSelection();

            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    const fetchingStockData = async (item) => {
        let result = await mergeProductQuantities(document, item.Id);
        setDocument(result);
        changeSelection();
    }

    return (
        <ManageCard>
            <div style={styles.header}>
                <IoPerson size={20} color={theme.grey} />
                <span style={{
                    color: theme.grey
                }}>Qarşı-Tərəf</span>
            </div>

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
                    bottomText={local?.demands?.demandReturn?.customerDebt ? document.CustomerInfo != undefined ? formatPrice(document.CustomerInfo.Debt) : "0" : ""}
                    bottomTitle={'Qarşı-Tərəf'}
                />

                <Selection
                    isRequired={true}
                    apiName={'stocks/get.php'}
                    apiBody={{}}
                    change={fetchingStockData}
                    value={document.StockId}
                    defaultValue={document.StockName}
                    title={'Anbar'}
                />

            </div>
        </ManageCard>
    )
}

export default BuyerCard;
