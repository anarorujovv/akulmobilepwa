import React, { useContext } from 'react';
import useTheme from '../../../shared/theme/useTheme';
import Input from '../../../shared/ui/Input';
import { ProductGlobalContext } from '../../../shared/data/ProductGlobalState';
import { IoPricetag } from 'react-icons/io5';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import permission_ver from '../../../services/permissionVerification';

const PriceCard = ({ changeInput }) => {

  let { product } = useContext(ProductGlobalContext);
  const permissions = useGlobalStore(state => state.permissions);

  let theme = useTheme();

  const styles = {
    container: {
      width: '100%',
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 50,
      boxShadow: `0 2px 4px ${theme.black}20`
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      padding: 15,
      alignItems: 'center',
      boxSizing: 'border-box'
    },
    center: {
      gap: 10,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <IoPricetag size={20} color={theme.grey} />
        <span style={{
          color: theme.grey
        }}>Qiymət</span>
      </div>
      <div style={styles.center}>

        <Input
          placeholder={"Satış qiymət"}
          value={product.Price}
          width={'70%'}
          type={'number'}
          onChange={(e) => {
            changeInput('Price', e);
          }} />

        {
          permission_ver(permissions, 'sub_buy_price', 'R') ?
            <Input
              type={'number'}
              placeholder={"Alış qiymət"}
              value={product.BuyPrice}
              width={'70%'}
              onChange={(e) => {
                changeInput('BuyPrice', e)
              }}
            />
            :
            ""
        }

        <Input
          type={'number'}
          placeholder={"Minimal qiymət"}
          value={product.MinPrice}
          width={'70%'}
          onChange={(e) => {
            changeInput('MinPrice', e);
          }}
        />

      </div>
    </div>
  )
}

export default PriceCard;
