import React from 'react';
import useTheme from "../../theme/useTheme";
import { FaCube, FaShoppingBasket } from 'react-icons/fa';
import Line from '../Line';
import useGlobalStore from '../../data/zustand/useGlobalStore';

const ListItem = ({ firstText, centerText, endText, notIcon, priceText, priceBottomText, iconBasket, notPriceIcon, statusText, status, onPress, onLongPress, index, markId, indexIsButtonIcon, indexIsButtonIconPress, deactiveStatus }) => {

  let theme = useTheme();
  let marks = useGlobalStore(state => state.marks);

  // markId varsa, ilgili mark bilgisini al
  const currentMark = markId ? marks.find(mark => mark.Id == markId) : null;

  const opacity = deactiveStatus ? 0.5 : 1;

  const styles = {
    container: {
      width: '100%',
      minHeight: 70,
      display: 'flex',
      flexDirection: 'row',
      opacity: opacity,
      cursor: 'pointer',
      backgroundColor: theme.bg,
      boxSizing: 'border-box',
      transition: 'background-color 0.2s',
      padding: '10px 0'
    },
    left: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    indexBox: {
      width: 20,
      height: 20,
      borderRadius: 2,
      border: `1px solid ${status == undefined ? theme.primary : status ? theme.primary : theme.red}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: status == undefined ? theme.primary : status ? theme.primary : theme.red,
      fontSize: 10
    },
    iconButton: {
      width: 30,
      height: 30,
      borderRadius: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    center: {
      flex: 5,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 2
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      width: '85%',
    },
    firstText: {
      fontSize: 12
    },
    statusText: {
      fontSize: 10,
      color: status ? theme.green : theme.red,
      border: `1px solid ${status ? theme.green : theme.red}`,
      borderRadius: 5,
      padding: '0 5px',
    },
    mark: {
      backgroundColor: currentMark?.Color,
      padding: '2px 6px',
      borderRadius: 4,
    },
    markText: {
      fontSize: 10,
      color: '#fff',
    },
    centerText: {
      color: 'black'
    },
    endTextContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    right: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10
    }
  };

  return (
    <>
      <div
        onClick={onPress}
        style={styles.container}
        onContextMenu={(e) => {
          e.preventDefault();
          if (onLongPress) onLongPress();
        }}
      >
        <div style={styles.left}>
          {
            !indexIsButtonIcon ?
              (<div style={styles.indexBox}>
                <span>{index}</span>
              </div>)
              :
              <button
                style={styles.iconButton}
                onClick={(e) => {
                  e.stopPropagation();
                  indexIsButtonIconPress();
                }}
              >
                {indexIsButtonIcon}
              </button>
          }
        </div>
        <div style={styles.center}>
          <div style={styles.row}>
            {
              firstText != undefined ?
                <span style={styles.firstText}>{firstText}</span>
                :
                null
            }
            {
              statusText != undefined ?
                <span style={styles.statusText}>{statusText}</span>
                : null
            }
            {
              currentMark != null ?
                <div style={styles.mark}>
                  <span style={styles.markText}>{currentMark.Name}</span>
                </div>
                : null
            }
          </div>
          {
            centerText != undefined ?
              <span style={styles.centerText}>{centerText}</span>
              :
              null
          }
          {
            endText != undefined ?
              <div style={styles.endTextContainer}>
                {
                  !notIcon ?
                    !iconBasket ?
                      <FaCube size={10} color={endText > 0 ? theme.green : theme.red} />
                      :
                      <FaShoppingBasket size={10} color={endText > 0 ? theme.green : theme.red} />
                    :
                    null

                }
                <span style={{
                  fontSize: 12,
                  color: !notIcon ? (endText > 0 ? theme.green : theme.red) : 'inherit'
                }}>{endText}</span>
              </div>
              :
              null
          }
        </div>
        <div style={styles.right}>
          {
            priceText != undefined ?
              <span style={{
                color: theme.black
              }}>{priceText} {!notPriceIcon && '₼'}</span>
              :
              null
          }
          {
            priceBottomText != undefined ?
              <span style={{
                color: theme.black,
                fontSize: 12
              }}>{priceBottomText} {!notPriceIcon && '₼'}</span>
              :
              null
          }
        </div>
      </div>
      <Line width={'100%'} />
    </>
  );
};

export default ListItem;