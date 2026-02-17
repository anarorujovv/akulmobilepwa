import React, { useContext } from 'react';
import { Card, Form, Input } from 'antd-mobile';
import useTheme from '../../../shared/theme/useTheme';
import { CustomerGlobalContext } from '../../../shared/data/CustomerGlobalState';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import { FaUser, FaSync } from 'react-icons/fa';
import Selection from '../../../shared/ui/Selection';

const MainCard = ({ changeInput }) => {
  let theme = useTheme();
  const { document, setDocument } = useContext(CustomerGlobalContext);

  if (!document) return null;

  const handleChange = (type, value) => {
    changeInput(type, value);
  };

  const fetchingBarCode = async () => {
    let obj = {
      w: 2,
      token: await AsyncStorageWrapper.getItem('token')
    };
    await api('barcode/get.php', obj)
      .then(element => {
        if (element != null) {
          // Update both input and document directly to be sure
          handleChange('Card', element);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  return (
    <Card title={
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaUser color={theme.grey} size={20} />
        <span style={{ color: theme.grey, fontWeight: 'bold' }}>Tərəf-müqabil</span>
      </div>
    }>
      <Form layout='horizontal'>
        <Form.Item label='Ad'>
          <Input
            placeholder='Tərəf müqabilinin adı'
            value={document.Name}
            onChange={(val) => handleChange('Name', val)}
          />
        </Form.Item>

        <Form.Item label='Qrup'>
          <Selection
            isRequired={true}
            apiBody={{}}
            apiName={'customergroups/get.php'}
            change={(item) => {
              setDocument(prev => ({ ...prev, GroupId: item.Id, GroupName: item.Name }));
            }}
            title={'Qrup'}
            value={document.GroupId}
            defaultValue={document.GroupName}
          />
        </Form.Item>

        <Form.Item label='Qiymət'>
          <Selection
            apiBody={{}}
            apiName={'pricetypes/get.php'}
            value={document.PriceTypeId}
            defaultValue={document.PriceTypeName}
            change={(e) => {
              setDocument(prev => ({ ...prev, PriceTypeId: e.Id, PriceTypeName: e.Name }));
            }}
            title={'Qiymət'}
          />
        </Form.Item>

        <Form.Item label='Telefon'>
          <Input
            placeholder='Telefon'
            type='number'
            value={document.Phone}
            onChange={(val) => handleChange('Phone', val)}
          />
        </Form.Item>

        <Form.Item
          label='Kart'
          extra={
            <FaSync onClick={fetchingBarCode} size={20} color={theme.primary} style={{ cursor: 'pointer' }} />
          }
        >
          <Input
            placeholder='Kart'
            type='number'
            value={document.Card}
            onChange={(val) => handleChange('Card', val)}
          />
        </Form.Item>

        <Form.Item label='Endirim %'>
          <Input
            placeholder='Endirim %'
            type='number'
            value={document.Discount}
            onChange={(val) => handleChange('Discount', val)}
          />
        </Form.Item>

        <Form.Item label='Bonus'>
          <Input
            placeholder='Bonus'
            type='number'
            value={document.Bonus}
            onChange={(val) => handleChange('Bonus', val)}
          />
        </Form.Item>

        <Form.Item label='Email'>
          <Input
            placeholder='Email'
            value={document.Mail}
            onChange={(val) => handleChange('Mail', val)}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MainCard;
