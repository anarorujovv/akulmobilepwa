import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import useTheme from '../../theme/useTheme'
import SimpleLineneIcon from 'react-native-vector-icons/SimpleLineIcons'
import Avatar from '../Avatar'
import { formatPrice } from '../../../services/formatPrice';
import { Pressable } from '@react-native-material/core';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

/**
 * index prop'u eklendi.
 */
const ProductListItem = ({ product, onPress, onLongPress, iconCube, marginTop, marginBottom, type, isActive, priceType, index }) => {

  const theme = useTheme();

  const styles = StyleSheet.create({
    itemContainer: {
      flex: 1,
      minHeight: 65,
      width: '100%',
      backgroundColor: isActive ? theme.whiteGrey : theme.bg,
    },
    itemChildContainer: {
      flex: 1,
      minHeight: 65,
      width: '100%',
      flexDirection: 'row'
    },
    left: {
      width: '18%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    center: {
      width: '57%',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start'
    },
    header: {
      color: theme.black,
    },
    footerTextContainer: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconContainer: {
      width: 15,
      height: 15,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center'
    },
    right: {
      width: '15%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    indexContainer: {
      position: 'absolute',
      left: 5,
      top: 5,
      backgroundColor: theme.bg,
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
      zIndex: 2,
      minWidth: 22,
      alignItems: 'center',
      justifyContent: 'center'
    },
    indexText: {
      color: theme.black,
      fontWeight: 'bold',
      fontSize: 12
    }
  });

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
    <Pressable onLongPress={onLongPress} onPress={onPress} style={styles.itemContainer}>
      <View style={[styles.itemChildContainer, {
        marginTop: marginTop,
        marginBottom: marginBottom
      }]}>
        {/* Index gösterimi */}
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index || 'not'}</Text>
        </View>
        <View style={styles.left}>
          <Avatar 
            txt={product.Name} 
            size={35}
            imageUrl={getImageUrl()}
          />
        </View>
        <View style={styles.center}>
          <Text style={styles.header}>{product.Name}</Text>
          <Text style={[styles.header,{fontSize:13,color:"grey"}]}>{product.BarCode}</Text>
          <View style={styles.footerTextContainer}>
            <>
              <View style={[styles.iconContainer, {
                backgroundColor: formatPrice(product.StockBalance) < 0 ? theme.red : theme.green
              }]}>
                {
                  iconCube ?
                    <FontAwesome name='cube' size={8} color={theme.stable.white} />
                    :
                    <SimpleLineneIcon size={8} name='basket' color={theme.stable.white} />
                }
              </View>

              <Text>{formatPrice(product.StockBalance ? product.StockBalance : 0)}</Text>
            </>
          </View>

        </View>
        {
          priceType != undefined &&
          priceType != 9998 || 0 &&
            product.SelectedTypePrice != undefined ?
            <View style={styles.right}>
              <Text style={{
                color: theme.black
              }}>{type == 1 ? formatPrice(product.SelectedTypePrice) : formatPrice(product.SelectedTypePrice)}₼</Text>
            </View>
            :
            <View style={styles.right}>
              <Text style={{
                color: theme.black
              }}>{type == 1 ? formatPrice(product.BuyPrice) : formatPrice(product.Price)}₼</Text>
            </View>
        }

      </View>
    </Pressable>
  )
}

export default ProductListItem
