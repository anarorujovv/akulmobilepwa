import React from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import { IoBasket } from 'react-icons/io5';
import Button from '../../../shared/ui/Button';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import ListItem from '../../../shared/ui/list/ListItem';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../../services/permissionVerification';
import pricingUtils from '../../../services/pricingUtils';

const ProductCard = ({ document, setDocument, setHasUnsavedChanges }) => {

    const theme = useTheme();
    const permissions = useGlobalStore(state => state.permissions);

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
        }
    };

    return (
        <ManageCard>
            <div style={styles.header}>
                <IoBasket size={23} color={theme.grey} />
                <span style={{
                    color: theme.grey
                }}>Məhsul</span>
            </div>
            <div style={styles.container}>

                {
                    document.Positions.map((item, index) => (
                        <div key={index} style={{ width: '100%' }}>
                            <ListItem
                                index={index + 1}
                                firstText={item.Name}
                                centerText={`${formatPrice(item.Quantity)} x ${formatPrice(item.Price)}`}
                                endText={formatPrice(item.StockQuantity)}
                                priceText={formatPrice(item.Quantity * item.Price)}
                                onLongPress={() => {
                                    if (window.confirm('Məhsulu silməyə əminsiniz?')) {
                                        let data = { ...document };
                                        data.Positions.splice(index, 1);
                                        setDocument({ ...data, ...(pricingUtils(data.Positions)) });
                                        setHasUnsavedChanges(true);
                                    }
                                }}
                            />
                        </div>
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
                        }}
                        width={'70%'}
                    >
                        Məhsul əlavə et
                    </Button>
                </div>
                {
                    permission_ver(permissions, 'mobilediscount', 'C') &&
                    document.BasicPrice &&
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
                }
                <div
                    style={styles.footerRow}>
                    <span style={{ fontSize: 16, color: theme.black }}>Yekun məbləğ</span>
                    <span style={{ fontSize: 16, color: theme.black }}>{formatPrice(document.Amount)} ₼</span>
                </div>
            </div>
        </ManageCard>
    )
}

export default ProductCard;
