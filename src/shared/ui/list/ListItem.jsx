import React from 'react';
import { Space, Tag } from 'antd-mobile';
import { CheckCircleFill, CloseCircleFill, AppstoreOutline, KoubeiOutline } from 'antd-mobile-icons';
import useGlobalStore from '../../data/zustand/useGlobalStore';

const ListItem = ({
  firstText,
  centerText,
  endText,
  notIcon,
  priceText,
  priceBottomText,
  iconBasket,
  notPriceIcon,
  statusText,
  status,
  onPress,
  onLongPress,
  index,
  markId,
  indexIsButtonIcon,
  indexIsButtonIconPress,
  deactiveStatus
}) => {
  let marks = useGlobalStore(state => state.marks);
  const currentMark = markId ? marks.find(mark => mark.Id == markId) : null;
  const opacity = deactiveStatus ? 0.5 : 1;

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
        padding: '12px 12px',
        backgroundColor: 'var(--adm-color-background)',
        borderBottom: '1px solid var(--adm-color-border)',
        cursor: 'pointer',
        opacity: opacity,
        position: 'relative'
      }}
    >
      {/* Index or Button Icon */}
      <div style={{ marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24 }}>
        {indexIsButtonIcon ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              indexIsButtonIconPress();
            }}
            style={{ cursor: 'pointer' }}
          >
            {indexIsButtonIcon}
          </div>
        ) : (
          <div style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            border: `1px solid ${status === undefined ? 'var(--adm-color-primary)' : status ? 'var(--adm-color-primary)' : 'var(--adm-color-danger)'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: status === undefined ? 'var(--adm-color-primary)' : status ? 'var(--adm-color-primary)' : 'var(--adm-color-danger)',
            fontSize: 11,
            fontWeight: 600
          }}>
            {index}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--adm-color-text)',
            marginRight: 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {firstText}
          </span>
          {statusText && (
            <Tag
              color={status ? 'success' : 'danger'}
              style={{ fontSize: 10, padding: '1px 4px' }}
            >
              {statusText}
            </Tag>
          )}
          {currentMark && (
            <Tag
              style={{
                backgroundColor: currentMark.Color,
                color: '#fff',
                fontSize: 10,
                padding: '1px 4px',
                marginLeft: 4
              }}
            >
              {currentMark.Name}
            </Tag>
          )}
        </div>

        {centerText && (
          <div style={{
            fontSize: 13,
            color: 'var(--adm-color-weak)',
            marginBottom: 4
          }}>
            {centerText}
          </div>
        )}

        {endText !== undefined && (
          <Space align='center' style={{ '--gap': '4px' }}>
            {!notIcon && (
              iconBasket ?
                <KoubeiOutline style={{ fontSize: 12, color: endText > 0 ? 'var(--adm-color-success)' : 'var(--adm-color-danger)' }} /> :
                <AppstoreOutline style={{ fontSize: 12, color: endText > 0 ? 'var(--adm-color-success)' : 'var(--adm-color-danger)' }} />
            )}
            <span style={{
              fontSize: 12,
              color: !notIcon ? (endText > 0 ? 'var(--adm-color-success)' : 'var(--adm-color-danger)') : 'var(--adm-color-weak)'
            }}>
              {endText}
            </span>
          </Space>
        )}
      </div>

      {/* Right Price Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: 8,
        flexShrink: 0
      }}>
        {priceText !== undefined && (
          <span style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--adm-color-primary)'
          }}>
            {priceText} {!notPriceIcon && '₼'}
          </span>
        )}
        {priceBottomText !== undefined && (
          <span style={{
            fontSize: 12,
            color: 'var(--adm-color-weak)',
            marginTop: 2
          }}>
            {priceBottomText} {!notPriceIcon && '₼'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ListItem;