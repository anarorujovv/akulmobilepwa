import React, { useContext, useState } from 'react';
import { Card, Input, Form, DatePicker, Button, Picker } from 'antd-mobile';
import useTheme from '../../../shared/theme/useTheme';
import { CustomerOrderGlobalContext } from '../../../shared/data/CustomerOrderGlobalState';
import paymethdemo from '../../../paymethdem';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import moment from 'moment';

const MainCard = ({ changeInput, changeSelection }) => {

  const theme = useTheme();

  const { document, setDocument } = useContext(CustomerOrderGlobalContext);
  const [momentModal, setMomentModal] = useState(false);
  const [paymentPickerVisible, setPaymentPickerVisible] = useState(false);
  const [isImplementLoading, setIsImplementLoading] = useState(false);

  const paymentOptions = paymethdemo.map(item => ({ label: item.value, value: item.key }));

  const handleImplement = async () => {
    setIsImplementLoading(true);
    await api(`customerorders/todemand.php`, {
      documentid: document.Id,
      token: await AsyncStorageWrapper.getItem('token')
    })
    setIsImplementLoading(false);
  }

  if (!document) return null;

  const getPaymentLabel = (val) => {
    const item = paymentOptions.find(i => i.value == val);
    return item ? item.label : '';
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary }}>Sifariş</span>
          {document && document.Id && (
            <Button
              onClick={handleImplement}
              size='small'
              color='primary'
              loading={isImplementLoading}
            >
              Təstiqlə
            </Button>
          )}
        </div>
      }
    >
      <Form layout='horizontal'>
        <Form.Item label='Ad'>
          <Input
            placeholder='Ad'
            value={document.Name}
            onChange={(val) => {
              changeInput('Name', val);
            }}
          />
        </Form.Item>

        <Form.Item label='Tarix' onClick={() => setMomentModal(true)}>
          <div style={{ padding: '4px 0', fontSize: 15 }}>
            {moment(document.Moment).format('YYYY-MM-DD HH:mm')}
          </div>
        </Form.Item>

        <Form.Item label='Sifariş növü' onClick={() => setPaymentPickerVisible(true)}>
          <div style={{ padding: '4px 0', fontSize: 15 }}>
            {getPaymentLabel(document.PaymentMethod) || 'Seçin'}
          </div>
        </Form.Item>
      </Form>

      <DatePicker
        visible={momentModal}
        onClose={() => setMomentModal(false)}
        defaultValue={new Date(document.Moment)}
        onConfirm={(val) => {
          changeSelection('Moment', moment(val).format('YYYY-MM-DD HH:mm:ss'))
        }}
      />

      <Picker
        columns={[paymentOptions]}
        visible={paymentPickerVisible}
        onClose={() => setPaymentPickerVisible(false)}
        value={[document.PaymentMethod]}
        onConfirm={(val) => {
          if (val && val[0]) {
            changeSelection('PaymentMethod', val[0]);
          }
        }}
      />

    </Card>
  )
}

export default MainCard;
