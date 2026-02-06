import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../../theme/useTheme'
import { formatPrice } from '../../../services/formatPrice';

const CardItem = ({ title, items, valueFormatPrice }) => {

    let theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.bg,            // Using theme background color
        },
        section: {
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.whiteGrey,     // Using theme's whiteGrey for section background
            borderColor: theme.grey,              // Using theme grey for border color
            borderWidth: 1,
        },
        sectionTitle: {
            backgroundColor: theme.primary,       // Using theme primary color for title background
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.bg,                      // Using theme bg color for text to ensure contrast
        },
        itemsContainer: {
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        itemRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 4,
            borderBottomWidth: 1,
            borderBottomColor: theme.whiteGrey,   // Using theme whiteGrey for row divider
        },
        itemKey: {
            fontSize: 14,
            color: theme.black,                   // Using theme black for item key text
        },
        itemValue: {
            fontSize: 14,
            color: theme.black,                   // Using theme black for item value text
        },
    })
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.itemsContainer}>
                {items.map((item, itemIndex) => (
                    item.value == null ?
                    ""
                    :
                    
                    <View key={itemIndex} style={styles.itemRow}>
                        <Text style={styles.itemKey}>{item.key}:</Text>
                        {
                            valueFormatPrice ?
                                <Text style={[styles.itemValue, { fontWeight: item.isBold && 'bold' }]}>{formatPrice(item.value)}</Text>
                                :
                                <Text style={[styles.itemValue, { fontWeight: item.isBold && 'bold' }]}>{item.value}</Text>

                        }
                    </View>
                ))}
            </View>
        </View>
    )
}

export default CardItem
