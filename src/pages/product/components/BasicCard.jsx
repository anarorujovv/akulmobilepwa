import React, { useContext } from 'react';
import { ProductGlobalContext } from '../../../shared/data/ProductGlobalState';
import Input from './../../../shared/ui/Input';
import useTheme from '../../../shared/theme/useTheme';
import IconButton from '../../../shared/ui/IconButton';
import { IoSync, IoScan } from 'react-icons/io5';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import Selection from './../../../shared/ui/Selection';
import { useNavigate } from 'react-router-dom';

const BasicCard = ({ id, changeInput, changeSelection }) => {
  const navigate = useNavigate();

  const { product, setProduct } = useContext(ProductGlobalContext);
  const theme = useTheme();


  const styles = {
    container: {
      width: '100%',
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 25,
      boxShadow: `0 2px 4px ${theme.black}20` // Approximate elevation
    },
    bottomContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      gap: 10
    }
  }

  const handleBarcodeGenerate = async () => {
    await api('barcode/get.php', {
      w: 0,
      token: await AsyncStorageWrapper.getItem('token')
    }).then(element => {
      if (element != null) {
        setProduct(rel => ({ ...rel, ['BarCode']: String(element) }));
      }
    }).catch(err => {
      ErrorMessage(err)
    })
  }

  const handleScanner = async () => {
    navigate('/product/product-scanner', {
      state: {
        setData: (e) => {
          setProduct(rel => ({ ...rel, BarCode: e }));
        }
      }
    });
  }


  return (
    <div style={styles.container}>
      <div style={{
        width: '100%',
        padding: 15,
        boxSizing: 'border-box'
      }}>
        <span style={{
          fontSize: 20,
          color: theme.primary,
          fontWeight: 'bold',
          display: 'block'
        }}>Məhsul Və Xidmətlər</span>
      </div>
      <div style={styles.bottomContainer}>

        <Input value={product.Name} isRequired={true} onChange={(e) => {
          changeInput('Name', e);
        }} placeholder={'Məhsulun adı'} width={'70%'} />

        <div style={{
          width: '70%',
          display: 'flex',
          flexDirection: "column",
          alignItems: 'flex-start'
        }}>
          <Input disabled={product.IsWeight == 1} onChange={(e) => {
            changeInput('BarCode', e);
          }} type={'number'} value={product.BarCode} placeholder={'Barkod'} width={'100%'}
            rightIcon={
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                paddingRight: 10
              }}>
                <IconButton size={25} disabled={product.IsWeight == 1 ? true : false} onPress={handleBarcodeGenerate}>
                  <IoSync size={24} color={product.IsWeight == 1 ? theme.grey : theme.black} />
                </IconButton>
                <IconButton size={25} disabled={product.IsWeight == 1 ? true : false} onPress={handleScanner}>
                  <IoScan size={24} color={product.IsWeight == 1 ? theme.grey : theme.black} />
                </IconButton>
              </div>
            }
          />
        </div>

        <Input value={product.ArtCode} onChange={(e) => {
          changeInput('ArtCode', e);
        }} placeholder={'Artkod'} width={'70%'} />

        <Input value={product.Quantity} onChange={(e) => {
          changeInput('Quantity', e);
        }} placeholder={'İlkin qalıq'} type={'number'} width={'70%'} />

        <Selection
          apiName={'customers/getfast.php'}
          apiBody={{}}
          searchApi={'customers/getfast.php'}
          searchKey={'fast'}
          value={product.CustomerId}
          title={'Təchizatçı'}
          defaultValue={product.CustomerName}
          change={(item) => {
            setProduct(rel => ({ ...rel, ['CustomerId']: item.Id }));
            changeSelection();
          }}
        />

        <Selection
          isRequired={true}
          apiBody={{}}
          apiName={'productfolders/get.php'}
          value={product.GroupId}
          defaultValue={product.GroupName}
          title={'Qrup'}
          change={(item) => {
            setProduct(rel => ({ ...rel, ['GroupId']: item.Id }));
            changeSelection();
          }}
        />

      </div>

    </div>
  )
}

export default BasicCard;