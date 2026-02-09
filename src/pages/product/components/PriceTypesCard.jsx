import React from 'react';
import { IoPricetag } from 'react-icons/io5';
import ManageCard from '../../../shared/ui/ManageCard';
import useTheme from '../../../shared/theme/useTheme';
import Input from '../../../shared/ui/Input';
import { formatPrice } from '../../../services/formatPrice';

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
    content: {
      width: '100%',
      paddingLeft: 15,
      paddingRight: 15,
      gap: 15,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    },
    title: {
      color: theme.grey
    }
  }

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
      <div style={styles.header}>
        <IoPricetag size={23} color={theme.grey} />
        <span style={styles.title}>Qiymət tipləri</span>
      </div>
      <div style={styles.content}>
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
          <span style={{ color: theme.grey, textAlign: 'center', padding: 10, display: 'block' }}>Fiyat tipi bulunamadı</span>
        )}
      </div>
    </ManageCard>
  )
}

export default PriceTypesCard;