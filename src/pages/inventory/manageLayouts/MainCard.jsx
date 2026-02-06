import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import { InventoryGlobalContext } from '../../../shared/data/InventoryGlobalState';
import mergeProductQuantities from './../../../services/mergeProductQuantities';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';
import Selection from '../../../shared/ui/Selection';
import Button from '../../../shared/ui/Button';
import MyModal from '../../../shared/ui/MyModal';
import CustomSelection from '../../../shared/ui/CustomSelection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../../services/formatPrice';
import SuccessMessage from '../../../shared/ui/RepllyMessage/SuccessMessage';

const MainCard = ({ changeInput, changeSelection,setHasUnsavedCahnges }) => {

  let theme = useTheme();

  const { document, setDocument, setUnits } = useContext(InventoryGlobalContext);
  const [momentModal, setMomentModal] = useState(false);
  const [stockBalanceModal, setStockBalanceModal] = useState(false);
  const [stockBalanceType, setStockBalanceType] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [isImplementLoading, setIsImplementLoading] = useState(false);

  let fetchingStockId = async (item) => {
    let result = await mergeProductQuantities(document, item.Id);
    changeSelection();
    setDocument(result);
  }

  const stockBalanceOptions = [
    { key: "0", value: "Hamısı" },
    { key: "1", value: "Müsbətlər" },
    { key: "2", value: "Mənfilər" },
    { key: "3", value: "0 olmayanlar" },
    { key: "4", value: "0 olanlar" }
  ];

  const fetchStockBalance = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];
      
      const data = {
        stockName: document.StockId,
        moment: currentDate,
        lm: 99999,
        zeros: stockBalanceType,
        token: token
      };
      
      const result = await api('stockbalance/get.php', data);
      
      if (result) {
        const newPositions = [...document.Positions];
        let newUnits = {};
        
        if (result.PositionUnits) {
          Object.keys(result.PositionUnits).forEach(productId => {
            newUnits[productId] = result.PositionUnits[productId];
          });
        }
        
        if (result.List && result.List.length > 0) {
          result.List.forEach(product => {
            const existingIndex = newPositions.findIndex(pos => pos.ProductId === product.ProductId);
            const quantity = Math.abs(Number(product.Quantity || 0));
            
            const newProduct = {
              ProductId: product.ProductId,
              Name: product.ProductName,
              BarCode: product.BarCode,
              GroupName: product.GroupName,
              UnitId: product.UnitId,
              UnitName: product.UnitName,
              UnitTitle: product.UnitTitle,
              Price: formatPrice(product.Price),
              BasicPrice: formatPrice(product.Price),
              BuyPrice: formatPrice(product.BuyPrice || 0),
              CostPrice: formatPrice(product.BuyPrice || 0),
              MinPrice: formatPrice(product.MinPrice || 0),
              StockQuantity: formatPrice(product.Quantity),
              Quantity: formatPrice(quantity),
              Discount: "0",
              Difference: formatPrice(0),
              AllSum: formatPrice(quantity * Number(product.Price || 0)),
              IsArch: product.IsArch || 0,
              IsWeight: product.IsWeight || 0,
              IsParty: product.IsParty || 0
            };
            
            if (existingIndex !== -1) {
              newPositions[existingIndex] = newProduct;
            } else {
              newPositions.push(newProduct);
            }
          });
        }
        
        setUnits(prevUnits => {
          const oldUnits = Array.isArray(prevUnits) ? {} : (prevUnits || {});
          return {
            ...oldUnits,
            ...newUnits
          };
        });
        
        setDocument(prev => {
          return {
            ...prev,
            Positions: newPositions,
            hasUnsavedChanges: true
          };
        });
        
        setStockBalanceModal(false);

        setHasUnsavedCahnges(true);
      }
    } catch (error) {
      ErrorMessage(error.message || "Anbar qalığı alınarkən xəta baş verdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImplement = async () => {
    setIsImplementLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      const data = {
        id: document.Id,
        missing: false,
        token: token
      };
      
      const result = await api('inventories/implement.php', data);
      
      if (result && result.ResponseStatus === "0") {
        SuccessMessage("Əməliyyat uğurla tamamlandı");
        setDocument(prev => ({
          ...prev,
          hasUnsavedChanges: false
        }));
        setHasUnsavedCahnges(false);
      }
    } catch (error) {
      ErrorMessage(error.message || "Təsdiqləmə zamanı xəta baş verdi");
    } finally {
      setIsImplementLoading(false);
    }
  };

  return (
    <ManageCard>

      <View style={{
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 20,
          color: theme.primary
        }}>İnventarizasiya</Text>
        
        {document && document.Id && (
          <Button 
            onClick={handleImplement} 
            width={'40%'} 
            bg={theme.primary}
            isLoading={isImplementLoading}
          >
            Təstiqlə
          </Button>
        )}
      </View>

      <View style={{
        marginTop: 20,
        gap: 20,
        alignItems: 'center'
      }}>

        <Input
          placeholder={'Ad'}
          type={'string'}
          width={'70%'}
          value={document.Name}
          onChange={(e) => {
            changeInput('Name', e)
          }}
        />

        <SelectionDate
          document={document}
          setDocument={setDocument}
          change={changeSelection}
          modalVisible={momentModal}
          setModalVisible={setMomentModal}
        />


        <Selection
          isRequired={true}
          change={fetchingStockId}
          apiBody={{}}
          apiName={'stocks/get.php'}
          value={document.StockId}
          title={'Anbar'}
          defaultValue={document.StockName}
        />

        {document.StockId && document.StockId !== '' && (
          <Button 
            onClick={() => setStockBalanceModal(true)} 
            width={'70%'} 
            bg={theme.primary}
          >
            Anbar qalığı
          </Button>
        )}
      </View>

      <MyModal
        modalVisible={stockBalanceModal}
        setModalVisible={setStockBalanceModal}
        width="90%"
        height="30%"
        center
      >
        <View style={{ padding: 15, flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary, textAlign: 'center', marginBottom: 20 }}>
            Anbar qalığı
          </Text>
          <View style={{ marginVertical: 15 }}>
            <CustomSelection
              options={stockBalanceOptions}
              value={stockBalanceType}
              onChange={setStockBalanceType}
              title="Filtrlə"
              placeholder="Filtrlə"
            />
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button
              onClick={() => setStockBalanceModal(false)}
              width={'48%'}
              bg={theme.grey}
            >
              Bağla
            </Button>
            <Button
              onClick={fetchStockBalance}
              width={'48%'}
              isLoading={isLoading}
            >
              Endir
            </Button>
          </View>
        </View>
      </MyModal>
    </ManageCard>
  )
}

export default MainCard
