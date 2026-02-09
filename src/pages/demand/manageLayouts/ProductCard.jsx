import React, { useContext, useState } from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import { IoBasket, IoInformationCircleOutline } from 'react-icons/io5'; // Using react-icons
import Button from '../../../shared/ui/Button';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import { DemandGlobalContext } from '../../../shared/data/DemandGlobalState';
import pricingUtils from '../../../services/pricingUtils';
// import prompt from '../../../services/prompt'; // Use window.confirm
import ListItem from '../../../shared/ui/list/ListItem';
import AmountCalculated from '../../../shared/ui/AmountCalculated';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../../services/permissionVerification';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import api from '../../../services/api';
import MyModal from '../../../shared/ui/MyModal';
import AllChangeProductPriceType from '../../../shared/ui/AllChangeProductPriceType';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ setHasUnsavedChanges }) => {
    const navigate = useNavigate();

    const { document, setDocument, units, setUnits } = useContext(DemandGlobalContext);
    const permissions = useGlobalStore(state => state.permissions);
    const local = useGlobalStore(state => state.local);

    const [amountEditModal, setAmountEditModal] = useState(false);
    const [productLastPrice, setProductLastPrice] = useState(0);
    const [productLastPriceModal, setProductLastPriceModal] = useState(false);

    const theme = useTheme();

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
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5
        },
        footerRow: {
            width: '70%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    };

    const handleClickProductLastPrice = async (item) => {
        let obj = {
            customerid: document.CustomerId,
            moment: document.Moment,
            productid: item.ProductId,
            token: await AsyncStorageWrapper.getItem('token')
        }

        await api('lastdemandprice/get.php', obj).then(element => {
            setProductLastPrice(formatPrice(element.DocPrice))
            setProductLastPriceModal(true);
        }).catch(err => console.log(err));
    }

    return (
        <ManageCard>
            <div style={styles.header}>
                <IoBasket size={23} color={theme.grey} />
                <span style={{
                    color: theme.grey
                }}>Məhsul</span>
            </div>

            <div style={styles.container}>

                <AllChangeProductPriceType document={document} setDocument={setDocument}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                />

                {
                    document.Positions.map((item, index) => (
                        <ListItem
                            key={index}
                            indexIsButtonIconPress={() => {
                                handleClickProductLastPrice(item);
                            }}
                            indexIsButtonIcon={<IoInformationCircleOutline size={30} color={theme.primary} />}
                            index={index + 1}
                            onLongPress={() => {
                                if (window.confirm('Məhsulu silməyə əminsiniz?')) {
                                    let data = { ...document };
                                    data.Positions.splice(index, 1);
                                    setDocument({ ...data, ...(pricingUtils(data.Positions)) });
                                    setHasUnsavedChanges(true); // Moved here to be inside callback if valid
                                }
                            }}
                            onPress={() => {
                                // Assuming we have a product-position route or modal
                                // The original code navigated to 'product-position'
                                navigate('/product-position', {
                                    state: {
                                        product: item,
                                        state: document,
                                        setState: setDocument, // setState via state might update global context if logic exists there, but usually unsafe to pass setter via state. 
                                        // However, since we use GlobalContext, maybe we don't need to pass setDocument if product-position uses context?
                                        // Original code passed it. I'll keep it in state, but logic in target page needs to use it or context.
                                        type: 0,
                                        units: units,
                                        setUnits: setUnits,
                                        setHasUnsavedChanges: setHasUnsavedChanges,
                                        pricePermission: local.demands.demand.positionModalPrice
                                    }
                                })
                            }}
                            firstText={item.Name}
                            centerText={`${formatPrice(item.Quantity)} x ${formatPrice(item.Price)}`}
                            endText={formatPrice(item.StockQuantity)}
                            priceText={local.demands.demandReturn.positionPrice ? formatPrice(item.Quantity * item.Price) : ""}
                        />
                    ))

                }
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'center',
                    marginBottom: 30,
                    marginTop: 10,
                    width: '100%'
                }}>
                    <Button
                        onClick={() => {
                            navigate("/product-list", {
                                state: {
                                    state: document,
                                    setState: setDocument,
                                    type: 0,
                                    units: units,
                                    setUnits: setUnits,
                                    setHasUnsavedChanges: setHasUnsavedChanges,
                                    pricePermission: local.demands.demand.positionModalPrice
                                }
                            });
                        }}
                        width={'70%'}
                    >
                        Məhsul əlavə et
                    </Button>
                </div>

                {
                    local.demands.demand.sum ?
                        <>
                            {
                                permission_ver(permissions, 'mobilediscount', 'C') ? (
                                    <>
                                        <div style={styles.footerRow}>
                                            <span style={{ fontSize: 14, color: theme.grey }}>Ümumi alış məbləği</span>
                                            <span style={{ fontSize: 14, color: theme.grey }}>{formatPrice(document.BasicAmount)} ₼</span>
                                        </div>
                                        <div style={styles.footerRow}>
                                            <span style={{ fontSize: 14, color: theme.grey }}>Endirim</span>
                                            <span style={{ fontSize: 14, color: theme.grey }}>{formatPrice(document.Discount)}%</span>
                                        </div>
                                    </>
                                )
                                    :
                                    ""
                            }

                            <div
                                onClick={() => {
                                    setAmountEditModal(true);
                                }}
                                style={{
                                    ...styles.footerRow,
                                    cursor: 'pointer'
                                }}>
                                <span style={{ fontSize: 16, color: theme.black }}>Yekun məbləğ</span>
                                <span style={{ fontSize: 16, color: theme.black }}>{formatPrice(document.Amount)} ₼</span>
                            </div>
                        </>
                        :
                        ""
                }
            </div>
            <AmountCalculated
                modalVisible={amountEditModal}
                setModalVisible={setAmountEditModal}
                document={document}
                setDocument={setDocument}
                setHasUnsavedChanges={setHasUnsavedChanges}
            />

            <MyModal center={true} height={100} modalVisible={productLastPriceModal} setModalVisible={setProductLastPriceModal} width={250}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: 25,
                        color: theme.primary,
                        marginBottom: 10
                    }}>SON SATIŞ QİYMƏTİ</span>
                    <span style={{
                        fontSize: 20,
                        color: theme.black,
                        fontWeight: 'bold'
                    }}>{productLastPrice} AZN</span>
                </div>
            </MyModal>
        </ManageCard>
    )
}

export default ProductCard;
