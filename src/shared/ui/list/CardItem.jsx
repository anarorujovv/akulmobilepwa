import React from 'react';
import useTheme from '../../theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';

const CardItem = ({ title, items, valueFormatPrice }) => {

    let theme = useTheme();

    const styles = {
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.bg,
        },
        section: {
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.whiteGrey,
            border: `1px solid ${theme.grey}`,
        },
        sectionTitle: {
            backgroundColor: theme.primary,
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.bg,
            margin: 0
        },
        itemsContainer: {
            padding: '5px 10px',
        },
        itemRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '4px 0',
            borderBottom: `1px solid ${theme.whiteGrey}`,
        },
        itemKey: {
            fontSize: 14,
            color: theme.black,
        },
        itemValue: {
            fontSize: 14,
            color: theme.black,
        },
    };

    return (
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>{title}</h3>
            <div style={styles.itemsContainer}>
                {items.map((item, itemIndex) => (
                    item.value == null ?
                        ""
                        :
                        <div key={itemIndex} style={styles.itemRow}>
                            <span style={styles.itemKey}>{item.key}:</span>
                            {
                                valueFormatPrice ?
                                    <span style={{ ...styles.itemValue, fontWeight: item.isBold ? 'bold' : 'normal' }}>{formatPrice(item.value)}</span>
                                    :
                                    <span style={{ ...styles.itemValue, fontWeight: item.isBold ? 'bold' : 'normal' }}>{item.value}</span>

                            }
                        </div>
                ))}
            </div>
        </div>
    );
};

export default CardItem;
