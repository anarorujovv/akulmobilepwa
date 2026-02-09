import React from 'react';
import useTheme from '../../theme/useTheme';
import { FaCube, FaShoppingBasket } from 'react-icons/fa';
import Avatar from '../Avatar';
import { formatPrice } from '../../../services/formatPrice';

/**
 * index prop'u eklendi.
 */
const ProductListItem = ({ product, onPress, onLongPress, iconCube, marginTop, marginBottom, type, isActive, priceType, index }) => {

  const theme = useTheme();

  const styles = {
    itemContainer: {
      width: '100%',
      minHeight: 65,
      backgroundColor: isActive ? theme.whiteGrey : theme.bg,
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    itemChildContainer: {
      width: '100%',
      minHeight: 65,
      display: 'flex',
      flexDirection: 'row',
      marginTop: marginTop,
      marginBottom: marginBottom,
      position: 'relative'
    },
    left: {
      width: '18%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    center: {
      width: '57%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start'
    },
    header: {
      color: theme.black,
      margin: 0
    },
    subHeader: {
      margin: 0,
      fontSize: 13,
      color: "grey"
    },
    footerTextContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconContainer: {
      width: 15,
      height: 15,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: formatPrice(product.StockBalance) < 0 ? theme.red : theme.green
    },
    right: {
      width: '15%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    indexContainer: {
      position: 'absolute',
      left: 5,
      top: 5,
      backgroundColor: theme.bg,
      borderRadius: 8,
      padding: '2px 6px',
      zIndex: 2,
      minWidth: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    indexText: {
      color: theme.black,
      fontWeight: 'bold',
      fontSize: 12
    }
  };

  const getImageUrl = () => {
    if (product.Pic) {
      if (typeof product.Pic === 'string' && (product.Pic.startsWith('http://') || product.Pic.startsWith('https://'))) {
        return product.Pic;
      }
    }

    // Eğer ürünün Images dizisi varsa, ilk resmi kullan
    if (product.Images && product.Images.length > 0) {
      const image = product.Images[0];
      return `${image.Path || image.path}${image.UniqName || image.uniqname}.${image.Ext || image.ext}`;
    }

    return null;
  };

  return (
    <div
      onClick={onPress}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onLongPress) onLongPress();
      }}
      style={styles.itemContainer}
    >
      <div style={styles.itemChildContainer}>
        {/* Index gösterimi */}
        <div style={styles.indexContainer}>
          <span style={styles.indexText}>{index || 'not'}</span>
        </div>
        <div style={styles.left}>
          <Avatar
            txt={product.Name}
            size={35}
            imageUrl={getImageUrl()}
          />
        </div>
        <div style={styles.center}>
          <h4 style={styles.header}>{product.Name}</h4>
          <span style={styles.subHeader}>{product.BarCode}</span>
          <div style={styles.footerTextContainer}>
            <>
              <div style={styles.iconContainer}>
                {
                  iconCube ?
                    <FaCube size={8} color={theme.stable.white} />
                    :
                    <FaShoppingBasket size={8} color={theme.stable.white} />
                }
              </div>

              <span>{formatPrice(product.StockBalance ? product.StockBalance : 0)}</span>
            </>
          </div>

        </div>
        {
          priceType != undefined &&
            priceType != 9998 || 0 &&
            product.SelectedTypePrice != undefined ?
            <div style={styles.right}>
              <span style={{
                color: theme.black
              }}>{type == 1 ? formatPrice(product.SelectedTypePrice) : formatPrice(product.SelectedTypePrice)}₼</span>
            </div>
            :
            <div style={styles.right}>
              <span style={{
                color: theme.black
              }}>{type == 1 ? formatPrice(product.BuyPrice) : formatPrice(product.Price)}₼</span>
            </div>
        }

      </div>
    </div>
  );
};

export default ProductListItem;
