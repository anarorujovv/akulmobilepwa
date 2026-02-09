import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ProductGlobalContext } from './../../shared/data/ProductGlobalState';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import useTheme from '../../shared/theme/useTheme';
import BasicCard from './components/BasicCard';
import PriceCard from './components/PriceCard';
import PriceTypesCard from './components/PriceTypesCard';
import StockAndStatusCard from './components/StockAndStatusCard';
import { formatPrice } from '../../services/formatPrice';
import { formatObjectKey } from './../../services/formatObjectKey';
import SuccessMessage from './../../shared/ui/RepllyMessage/SuccessMessage';
import ManageHeader from '../../shared/ui/ManageHeader';
import Button from '../../shared/ui/Button';
import DestinationCard from '../../shared/ui/DestinationCard';
import ModificationsCard from '../../shared/ui/ModificationsCard';
import buildModificationsPayload from '../../services/buildModificationsPayload';
// import playSound from '../../services/playSound'; // Skipping sound for web if needed or implement web audio
import { useLocation, useNavigate } from 'react-router-dom';

const ProductManage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  let theme = useTheme();

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.whiteGrey,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto'
    },
    top: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10
    },
    text: {
      fontSize: 18,
      color: theme.stable.white
    },
    content: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginBottom: '20px',
      padding: '10px'
    },
    loading: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }

  const { product, setProduct } = useContext(ProductGlobalContext);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [priceTypes, setPriceTypes] = useState([]);

  const fetchPriceTypes = async () => {
    try {
      let obj = {
        token: await AsyncStorageWrapper.getItem('token')
      }

      await api('pricetypes/get.php', obj).then(data => {
        if (data && data.List) {
          const filteredPriceTypes = data.List.filter(type =>
            type.Id !== 9999 && type.Id !== 9998 && type.Id !== 9997 && type.Id !== 9996
          );
          setPriceTypes(filteredPriceTypes);
        }
      }).catch(err => {
        ErrorMessage(err);
      });
    } catch (error) {
      ErrorMessage("Fiyat tipleri alınırken hata oluştu!");
    }
  };

  const fetchingProduct = async (id) => {

    if (id == null) {
      let defaultInfo = {
        VatTypeChecked: true,
        Name: "",
        GroupId: "",
        GroupName: "",
        IsMinQuantity: 1,
        BarCode: "",
        ArtCode: "",
        Modifications: [{}],
        Prices: [],
        IsArch: 0,
        IsWeight: 0,
        CustomerName: "",
        CustomerId: "",
        BuyPrice: 0,
        Price: 0,
        MinPrice: 0,
        Images: [],
        Quantity: 0
      }

      setProduct(defaultInfo);
    } else {
      let obj = {
        id: id,
        token: await AsyncStorageWrapper.getItem('token')
      }

      await api('products/get.php', obj).then(item => {
        if (item != null) {
          let prData = { ...item.List[0] };

          prData.Price = String(formatPrice(prData.Price))
          prData.BuyPrice = String(formatPrice(prData.BuyPrice))
          prData.MinPrice = String(formatPrice(prData.MinPrice))
          if (!prData.Modifications[0]) {
            prData.Modifications = [{}];
          }
          setProduct(prData)
        }
      }).catch(err => {
        ErrorMessage(err)
      })
    }
  }

  const handleSave = async () => {

    setLoading(true)

    let productData = { ...product }
    let data = formatObjectKey(productData);

    if (data.name == "" || data.groupid == "") {
      ErrorMessage("Vacib xanaları doldurun!")
    } else {
      data.token = await AsyncStorageWrapper.getItem('token');

      if (data.barcode == "") {
        await api('barcode/get.php', {
          w: 0,
          token: await AsyncStorageWrapper.getItem('token')
        }).then(element => {
          if (element != null) {
            data.barcode = element;
          }
        }).catch(err => {
          ErrorMessage(err)
        })
      }

      data.modifications = await buildModificationsPayload(data.modifications[0], 'product');
      await api('products/put.php', data).then(
        (element) => {
          if (element != null) {
            SuccessMessage("Yadda Saxlanıldı");
            fetchingProduct(element.ResponseService);
            setHasUnsavedChanges(false);
            // playSound('success');
          }
        }
      ).catch(
        (err) => {
          ErrorMessage(err);
        }
      )
    }

    setLoading(false)
  }

  const handleChangeFromHasUnsavedChangesState = () => {
    if (!hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
  }

  const handleChangeInput = (key, value) => {
    setProduct(rel => ({ ...rel, [key]: value }));
    handleChangeFromHasUnsavedChangesState();
  }

  const handlePriceTypeChange = (priceTypeId, value) => {
    const updatedProduct = { ...product };

    const existingPriceIndex = updatedProduct.Prices.findIndex(
      price => price.PriceType === parseInt(priceTypeId)
    );

    if (existingPriceIndex !== -1) {
      updatedProduct.Prices[existingPriceIndex].Price = value;
    } else {
      updatedProduct.Prices.push({
        PriceType: parseInt(priceTypeId),
        Price: value
      });
    }

    setProduct(updatedProduct);
    handleChangeFromHasUnsavedChangesState();
  };

  const handleChangeSelection = () => {
    handleChangeFromHasUnsavedChangesState();
  }

  useEffect(() => {
    fetchingProduct(id);
    fetchPriceTypes();
  }, [])

  return (
    <div style={styles.container}>
      <ManageHeader
        // navigation={navigation}
        hasUnsavedChanges={hasUnsavedChanges}
        print={'products'}
        document={product}
        type={'product'}
      // onSubmit={handleSave} 
      />
      {
        product === null ?
          <div style={styles.loading}>
            <div className="spinner"></div>
          </div>
          :
          <>
            <div style={styles.content}>
              <BasicCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
              <PriceCard changeInput={handleChangeInput} id={id} />
              <PriceTypesCard
                priceTypes={priceTypes}
                productPrices={product.Prices || []}
                changePriceType={handlePriceTypeChange}
              />
              <StockAndStatusCard changeInput={handleChangeInput} changeSelection={handleChangeSelection} id={id} />
              <DestinationCard
                document={product}
                setDocument={setProduct}
                changeInput={handleChangeInput}
                changeSelection={handleChangeSelection}
              />
              <ModificationsCard
                target={'product'}
                hasUnsavedChanged={setHasUnsavedChanges}
                setState={setProduct}
                state={product}
              />
            </div>
            {
              hasUnsavedChanges ?
                <div style={{ padding: '10px' }}>
                  <Button
                    bg={theme.green}
                    isLoading={loading}
                    onClick={handleSave}
                    disabled={loading}
                  >Yadda Saxla</Button>
                </div>
                :
                ""
            }
          </>
      }
    </div>
  )
}

export default ProductManage;
