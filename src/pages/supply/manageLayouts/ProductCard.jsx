import React, { useContext, useState } from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import { IoBasket } from 'react-icons/io5';
import Button from '../../../shared/ui/Button';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import { SupplyGlobalContext } from '../../../shared/data/SupplyGlobalState';
import pricingUtils from '../../../services/pricingUtils';
import ListItem from '../../../shared/ui/list/ListItem';
import permission_ver from '../../../services/permissionVerification';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import AmountCalculated from '../../../shared/ui/AmountCalculated';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ setHasUnsavedChanges }) => {
    const navigate = useNavigate();

    const { document, setDocument, units, setUnits } = useContext(SupplyGlobalContext)
    const [modal, setModal] = useState(false);


    let permissions = useGlobalStore(state => state.permissions);

    const theme = useTheme();

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
                    document.Positions.map((item, index) => {
                        return (
                            <div key={index} style={{ width: '100%' }}>
                                <ListItem
                                    index={index + 1}
                                    onLongPress={() => {
                                        if (window.confirm('Məhsulu silməyə əminsiniz?')) {
                                            let data = { ...document };
                                            data.Positions.splice(index, 1);
                                            setDocument({ ...data, ...(pricingUtils(data.Positions)) });
                                            setHasUnsavedChanges(true);
                                        }
                                    }}
                                    onPress={() => {
                                        navigate('/product-position', {
                                            state: {
                                                product: item,
                                                state: document,
                                                setState: setDocument,
                                                type: 1,
                                                units: units,
                                                setUnits: setUnits,
                                                setHasUnsavedChanges: setHasUnsavedChanges
                                            }
                                        })
                                    }}
                                    firstText={item.Name}
                                    centerText={`${formatPrice(item.Quantity)} x ${formatPrice(item.Price)}`}
                                    endText={formatPrice(item.StockQuantity)}
                                    priceText={formatPrice(item.Quantity * item.Price)}
                                />
                            </div>
                        )
                    })
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
                                    type: 1,
                                    units: units,
                                    setUnits: setUnits,
                                    setHasUnsavedChanges: setHasUnsavedChanges,
                                }
                            });
                        }}
                        width={'70%'}
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
                            setModal(true);
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
                modalVisible={modal}
                setModalVisible={setModal}
            />
        </ManageCard>
    )
}

export default ProductCard;
