import React, { useContext, useState } from 'react';
import { Card, Button, List, Modal } from 'antd-mobile';
import { IoBasket } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import pricingUtils from '../../../services/pricingUtils';
import ListItem from '../../../shared/ui/list/ListItem';
import { LossGlobalContext } from '../../../shared/data/LossGlobalState';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../../services/permissionVerification';
import PositionManage from '../../../shared/ui/PositionManage';
import DocumentProductList from '../../../shared/ui/DocumentProductList';

const ProductCard = ({ setHasUnsavedChanges }) => {

    const { document, setDocument, units, setUnits } = useContext(LossGlobalContext);
    const permissions = useGlobalStore(state => state.permissions);

    const [positionManageVisible, setPositionManageVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [productListVisible, setProductListVisible] = useState(false);

    const theme = useTheme();

    if (!document) return null;

    const styles = {
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.grey
        },
        footerRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
        }
    };

    return (
        <Card title={
            <div style={styles.header}>
                <IoBasket size={20} />
                <span>Məhsullar</span>
            </div>
        }>
            <List>
                {
                    document.Positions.map((item, index) => (
                        <ListItem
                            key={index}
                            index={index + 1}
                            onLongPress={() => {
                                Modal.confirm({
                                    title: 'Diqqət',
                                    content: 'Məhsulu silməyə əminsiniz?',
                                    onConfirm: () => {
                                        let data = { ...document };
                                        data.Positions.splice(index, 1);
                                        setDocument({ ...data, ...(pricingUtils(data.Positions)) });
                                        setHasUnsavedChanges(true);
                                    }
                                });
                            }}
                            onPress={() => {
                                setSelectedProduct(item);
                                setPositionManageVisible(true);
                            }}
                            firstText={item.Name}
                            centerText={`${formatPrice(item.Quantity)} x ${formatPrice(item.Price)}`}
                            endText={formatPrice(item.StockQuantity)}
                            priceText={formatPrice(item.Quantity * item.Price)}
                        />
                    ))
                }
            </List>
            <div style={{ padding: '20px 0' }}>
                <Button
                    block
                    color='primary'
                    fill='outline'
                    onClick={() => setProductListVisible(true)}
                >
                    Məhsul əlavə et
                </Button>
            </div>
            <>
                {
                    permission_ver(permissions, 'mobilediscount', 'C') && (
                        <>
                            <div style={styles.footerRow}>
                                <span style={{ color: theme.grey }}>Ümumi alış məbləği</span>
                                <span>{formatPrice(document.BasicAmount)} ₼</span>
                            </div>
                            <div style={styles.footerRow}>
                                <span style={{ color: theme.grey }}>Endirim</span>
                                <span>{formatPrice(document.Discount)}%</span>
                            </div>
                        </>
                    )
                }
                <div style={{ ...styles.footerRow, borderBottom: 'none', fontWeight: 'bold' }}>
                    <span style={{ fontSize: 16 }}>Yekun məbləğ</span>
                    <span style={{ fontSize: 16, color: theme.primary }}>{formatPrice(document.Amount)} ₼</span>
                </div>
            </>

            <PositionManage
                visible={positionManageVisible}
                onClose={() => setPositionManageVisible(false)}
                product={selectedProduct}
                state={document}
                setState={setDocument}
                units={units}
                type={0}
                setUnits={setUnits}
                setHasUnsavedChanges={setHasUnsavedChanges}
            />

            <DocumentProductList
                visible={productListVisible}
                onClose={() => setProductListVisible(false)}
                state={document}
                setState={setDocument}
                type={0}
                units={units}
                setUnits={setUnits}
                setHasUnsavedChanges={setHasUnsavedChanges}
            />
        </Card>
    )
}

export default ProductCard;
