import React, { useContext, useState } from 'react';
import { Card, Input, Form, DatePicker } from 'antd-mobile';
import { DemandGlobalContext } from '../../../shared/data/DemandGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import moment from 'moment';
import CustomSelection from '../../../shared/ui/CustomSelection';
import paymethdemo from '../../../paymethdem';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';

const MainCard = ({ changeInput, changeSelection }) => {

  const local = useGlobalStore(state => state.local);
  let theme = useTheme();

  const { document, setDocument } = useContext(DemandGlobalContext);
  const [momentModal, setMomentModal] = useState(false);


  return (
    <Card title={<span style={{ fontSize: 20, color: theme.primary }}>Satış</span>}>
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

        <Form.Item
          label='Tarix'
          clickable={local.demands.demand.date}
          onClick={() => {
            if (local.demands.demand.date) {
              setMomentModal(true);
            }
          }}
        >
          {document.Moment ? moment(document.Moment).format('YYYY-MM-DD HH:mm') : <span style={{ color: '#ccc' }}>Seçin</span>}
          <DatePicker
            visible={momentModal}
            onClose={() => {
              setMomentModal(false)
            }}
            precision='minute'
            onConfirm={val => {
              const dateMoment = moment(val).format('YYYY-MM-DD HH:mm:ss');
              changeSelection(new Date(dateMoment));
              setDocument(rel => ({ ...rel, ['Moment']: dateMoment }));
            }}
            renderLabel={(type, data) => {
              switch (type) {
                case 'year':
                  return data + ' il'
                case 'month':
                  return data + ' ay'
                case 'day':
                  return data + ' gün'
                case 'hour':
                  return data + ' saat'
                case 'minute':
                  return data + ' dəqiqə'
                default:
                  return data
              }
            }}
            title='Tarix seçimi'
          />
        </Form.Item>

        <Form.Item label='Satış növü'>
          <CustomSelection
            value={document.PaymentMethod}
            options={paymethdemo}
            onChange={(e) => {
              changeSelection('PaymentMethod', e);
            }}
            placeholder={'Satış novü'}
            title={'Satış növü'}
          />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default MainCard;
