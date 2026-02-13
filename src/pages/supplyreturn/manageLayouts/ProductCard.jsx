import React, { useContext, useState } from 'react';
import { Card, Button, List } from 'antd-mobile';
import { IoBasket, IoInformationCircleOutline } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import { SupplyReturnGlobalContext } from '../../../shared/data/SupplyReturnGlobalState';
import pricingUtils from '../../../services/pricingUtils';
import ListItem from '../../../shared/ui/list/ListItem';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import AmountCalculated from '../../../shared/ui/AmountCalculated';
import permission_ver from '../../../services/permissionVerification';
import { useNavigate } from 'react-router-dom';
import DocumentProductList from '../../../shared/ui/DocumentProductList';
import PositionManage from '../../../shared/ui/PositionManage';

const ProductCard = ({ setHasUnsavedChanges }) => {
    const navigate = useNavigate();

    const { document, setDocument, units, setUnits } = useContext(SupplyReturnGlobalContext);
    const [amountEditModal, setAmountEditModal] = useState(false);
    const permissions = useGlobalStore(state => state.permissions);

    // Modal States
    const [productListVisible, setProductListVisible] = useState(false);
    const [positionManageVisible, setPositionManageVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        footerRowClickable: {
            width: '70%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
        }
    };

    if (!document) return null;

    return (
        <Card
            title={
                <div style={styles.header}>
                    <IoBasket size={23} color={theme.grey} />
                    <span style={{ color: theme.grey }}>Məhsul</span>
                </div>
            }
        >
            <div style={styles.container}>
                <List>
                    {
                        document.Positions.map((item, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    indexIsButtonIcon={<IoInformationCircleOutline size={30} color={theme.primary} />}
                                    index={index + 1}
                                    onLongPress={() => {
                                        if (window.confirm('Məhsulu silməyə əminsiniz?')) {
                                            let data = { ...document };
                                            data.Positions.splice(index, 1);
                                            setDocument({ ...data, ...(pricingUtils(data.Positions)) });
                                            setHasUnsavedChanges(true); // Added unsaved changes
                                        }
                                    }}
                                    onPress={() => {
                                        // Open PositionManage modal instead of navigation
                                        setSelectedProduct(item);
                                        setPositionManageVisible(true);
                                    }}
                                    firstText={item.Name}
                                    centerText={`${formatPrice(item.Quantity)} x ${formatPrice(item.Price)}`}
                                    endText={formatPrice(item.StockQuantity)}
                                    priceText={formatPrice(item.Quantity * item.Price)}
                                />
                            )
                        })
                    }
                </List>

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
                        block
                        color='primary'
                        onClick={() => {
                            setProductListVisible(true);
                        }}
                        style={{ width: '70%' }}
                    >
                        Məhsul əlavə et
                    </Button>
                </div>
                <>
                    {
                        permission_ver(permissions, 'mobilediscount', 'C') && (
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
                    }
                    <div
                        onClick={() => {
                            setAmountEditModal(true);
                        }}
                        style={styles.footerRowClickable}>
                        <span style={{ fontSize: 16, color: theme.black }}>Yekun məbləğ</span>
                        <span style={{ fontSize: 16, color: theme.black }}>{formatPrice(document.Amount)} ₼</span>
                    </div>
                </>
            </div>
            <AmountCalculated
                setHasUnsavedChanges={setHasUnsavedChanges}
                document={document}
                setDocument={setDocument}
                modalVisible={amountEditModal}
                setModalVisible={setAmountEditModal}
            />

            <DocumentProductList
                visible={productListVisible}
                onClose={() => setProductListVisible(false)}
                state={document}
                setState={setDocument}
                type={1} // Assuming 1 for supply/buying related flows
                units={units}
                setUnits={setUnits}
                setHasUnsavedChanges={setHasUnsavedChanges}
                pricePermission={true} // Defaulting to true as no local config
            />

            <PositionManage
                visible={positionManageVisible}
                onClose={() => setPositionManageVisible(false)}
                product={selectedProduct}
                state={document}
                setState={setDocument}
                units={units}
                type={1}
                setUnits={setUnits}
                setHasUnsavedChanges={setHasUnsavedChanges}
                pricePermission={true} // Defaulting to true
            />
        </Card>
    )
}

export default ProductCard;
