import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ManageCard from '../../../shared/ui/ManageCard'
import useTheme from '../../../shared/theme/useTheme'
import Input from '../../../shared/ui/Input'
import { formatPrice } from '../../../services/formatPrice'

/**
 * Fiyat Tipleri Kartı Komponenti
 * 
 * @component PriceTypesCard
 * @param {Object} props - Komponent parametrləri
 * @param {Array} props.priceTypes - Tüm fiyat tiplerini içeren dizi
 * @param {Array} props.productPrices - Ürünün mevcut fiyat tiplerini içeren dizi
 * @param {Function} props.changePriceType - Fiyat tipi değişikliğini yöneten fonksiyon
 */
const PriceTypesCard = ({ priceTypes, productPrices, changePriceType }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      padding: 15,
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center'
    },
    content: {
      width: '100%',
      paddingLeft: 15,
      paddingRight: 15,
      gap: 15
    },
    title: {
      color: theme.grey
    }
  })

  // Ürünün belirli bir fiyat tipi için değerini bulma
  const getPriceValue = (priceTypeId) => {
    if (!productPrices || productPrices.length === 0) return "";
    
    const priceInfo = productPrices.find(price => price.PriceType === priceTypeId);
    if (priceInfo) {
      return String(formatPrice(priceInfo.Price));
    }
    return "";
  };

  return (
    <ManageCard>
      <View style={styles.header}>
        <Ionicons size={23} color={theme.grey} name='pricetag' />
        <Text style={styles.title}>Qiymət tipləri</Text>
      </View>
      <View style={styles.content}>
        {priceTypes && priceTypes.length > 0 ? (
          priceTypes.map(priceType => (
            <Input
              key={priceType.Id}
              value={getPriceValue(priceType.Id)}
              onChange={(value) => changePriceType(priceType.Id, value)}
              placeholder={priceType.Name}
              width={'100%'}
              type="number"
            />
          ))
        ) : (
          <Text style={{ color: theme.grey, textAlign: 'center', padding: 10 }}>Fiyat tipi bulunamadı</Text>
        )}
      </View>
    </ManageCard>
  )
}

export default PriceTypesCard 