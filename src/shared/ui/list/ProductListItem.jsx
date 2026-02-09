import React from 'react';
import { Space, Tag } from 'antd-mobile';
import { AppstoreOutlined, ShoppingOutlined } from '@ant-design/icons';
import Avatar from '../Avatar';
import { formatPrice } from '../../../services/formatPrice';

/**
 * ProductListItem - Ant Design Mobile uyumlu ürün listesi öğesi
 */
const ProductListItem = ({ product, onPress, onLongPress, iconCube, marginTop, marginBottom, type, isActive, priceType, index }) => {

  const getImageUrl = () => {
    if (product.Pic) {
      if (typeof product.Pic === 'string' && (product.Pic.startsWith('http://') || product.Pic.startsWith('https://'))) {
        return product.Pic;
      }
    }

    if (product.Images && product.Images.length > 0) {
      const image = product.Images[0];
      return `${image.Path || image.path}${image.UniqName || image.uniqname}.${image.Ext || image.ext}`;
    }

    return null;
  };

  const stockBalance = formatPrice(product.StockBalance ? product.StockBalance : 0);
  const isNegativeStock = formatPrice(product.StockBalance) < 0;

  const getPrice = () => {
    if (priceType !== undefined && priceType !== 9998 && product.SelectedTypePrice !== undefined) {
      return formatPrice(product.SelectedTypePrice);
    }
    return type === 1 ? formatPrice(product.BuyPrice) : formatPrice(product.Price);
  };

  return (
    <div
      onClick={onPress}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onLongPress) onLongPress();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        backgroundColor: isActive ? 'var(--adm-color-fill-content)' : 'transparent',
        cursor: 'pointer',
        marginTop: marginTop,
        marginBottom: marginBottom,
        position: 'relative'
      }}
    >
      {/* Index Badge */}
      {index && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 4,
          backgroundColor: 'var(--adm-color-background)',
          borderRadius: 6,
          padding: '2px 6px',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--adm-color-text)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          zIndex: 2
        }}>
          {index}
        </div>
      )}

      {/* Avatar */}
      <div style={{ marginRight: 12, flexShrink: 0 }}>
        <Avatar
          txt={product.Name}
          size={44}
          imageUrl={getImageUrl()}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          fontSize: 15,
          fontWeight: 500,
          color: 'var(--adm-color-text)',
          marginBottom: 4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {product.Name}
        </div>
        <div style={{
          fontSize: 13,
          color: 'var(--adm-color-weak)',
          marginBottom: 6
        }}>
          {product.BarCode}
        </div>
        <Space align='center' style={{ '--gap': '6px' }}>
          <Tag
            color={isNegativeStock ? 'danger' : 'success'}
            style={{
              '--border-radius': '4px',
              fontSize: 11,
              padding: '2px 6px'
            }}
          >
            <Space align='center' style={{ '--gap': '4px' }}>
              {iconCube ? (
                <AppstoreOutlined style={{ fontSize: 10 }} />
              ) : (
                <ShoppingOutlined style={{ fontSize: 10 }} />
              )}
              <span>{stockBalance}</span>
            </Space>
          </Tag>
        </Space>
      </div>

      {/* Price */}
      <div style={{
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--adm-color-primary)',
        flexShrink: 0,
        marginLeft: 8
      }}>
        {getPrice()}₼
      </div>
    </div>
  );
};

export default ProductListItem;
