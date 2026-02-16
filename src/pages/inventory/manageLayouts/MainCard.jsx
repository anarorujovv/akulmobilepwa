import React, { useContext, useState } from 'react';
import { Card, Input, Button, DatePicker, Selector, List, Form } from 'antd-mobile';
import { InventoryGlobalContext } from '../../../shared/data/InventoryGlobalState';
import mergeProductQuantities from './../../../services/mergeProductQuantities';
import useTheme from '../../../shared/theme/useTheme';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import api from '../../../services/api';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import { formatPrice } from '../../../services/formatPrice';
import SuccessMessage from '../../../shared/ui/RepllyMessage/SuccessMessage';
import moment from 'moment';
import MyModal from '../../../shared/ui/MyModal';
import CustomSelection from '../../../shared/ui/CustomSelection';
import Selection from '../../../shared/ui/Selection';

const MainCard = ({ changeInput, changeSelection, setHasUnsavedCahnges }) => {

  const theme = useTheme();
  const { document, setDocument, setUnits } = useContext(InventoryGlobalContext);
  const [stockBalanceModal, setStockBalanceModal] = useState(false);
  const [stockBalanceType, setStockBalanceType] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [isImplementLoading, setIsImplementLoading] = useState(false);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  if (!document) return null;

  const fetchingStockId = async (item) => {
    let result = await mergeProductQuantities(document, item.value);
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
      const token = await AsyncStorageWrapper.getItem('token');
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
      const token = await AsyncStorageWrapper.getItem('token');

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
    <Card>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }}>
        <div style={{ fontWeight: 'bold', fontSize: 16 }}>Əsas Məlumatlar</div>
        {document.Id && (
          <Button
            size='small'
            color='primary'
            loading={isImplementLoading}
            onClick={handleImplement}
          >
            Təsdiqlə
          </Button>
        )}
      </div>

      <Form layout='horizontal'>
        <Form.Item label='Ad'>
          <Input
            placeholder='Ad daxil edin'
            value={document.Name}
            onChange={(val) => changeInput('Name', val)}
          />
        </Form.Item>

        <Form.Item label='Tarix' onClick={() => setDatePickerVisible(true)}>
          <div style={{ padding: '4px 0', fontSize: 15 }}>
            {moment(document.Moment).format('YYYY-MM-DD HH:mm')}
          </div>
        </Form.Item>

        <Form.Item label='Anbar'>
          <Selection
            isRequired={true}
            change={fetchingStockId}
            apiBody={{}}
            apiName={'stocks/get.php'}
            value={document.StockId}
            title={'Anbar'}
            defaultValue={document.StockName}
          />

        </Form.Item>

        {document.StockId && document.StockId !== '' && (
          <Button
            block
            color='primary'
            onClick={() => setStockBalanceModal(true)}
            style={{ marginTop: 10 }}
          >
            Anbar qalığı
          </Button>
        )}
      </Form>

      <DatePicker
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        defaultValue={new Date(document.Moment)}
        onConfirm={(val) => {
          changeSelection('Moment', moment(val).format('YYYY-MM-DD HH:mm:ss'))
        }}
      />

      <MyModal
        modalVisible={stockBalanceModal}
        setModalVisible={setStockBalanceModal}
        width="90%"
        height="auto"
        center
      >
        <div style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary, textAlign: 'center', marginBottom: 20, display: 'block' }}>
            Anbar qalığı
          </span>
          <div style={{ margin: '15px 0' }}>
            <CustomSelection
              options={stockBalanceOptions}
              value={stockBalanceType}
              onChange={setStockBalanceType}
              title="Filtrlə"
              placeholder="Filtrlə"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button
              onClick={() => setStockBalanceModal(false)}
              style={{ width: '48%' }}
            >
              Bağla
            </Button>
            <Button
              onClick={fetchStockBalance}
              loading={isLoading}
              color='primary'
              style={{ width: '48%' }}
            >
              Endir
            </Button>
          </div>
        </div>
      </MyModal>
    </Card>
  )
}

export default MainCard;
