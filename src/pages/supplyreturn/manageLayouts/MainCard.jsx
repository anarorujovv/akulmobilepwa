import React, { useContext, useState } from 'react';
import { Card, Input, Form, DatePicker } from 'antd-mobile';
import { SupplyReturnGlobalContext } from '../../../shared/data/SupplyReturnGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import moment from 'moment';
// REMOVED useGlobalStore as local config is not used for SupplyReturn either

const MainCard = ({ changeInput, changeSelection }) => {

  let theme = useTheme();

  const { document, setDocument } = useContext(SupplyReturnGlobalContext);
  const [momentModal, setMomentModal] = useState(false);

  if (!document) return null;

  return (
    <Card title={<span style={{ fontSize: 20, color: theme.primary }}>Alış iadəsi</span>}>
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
          clickable={true}
          onClick={() => {
            setMomentModal(true);
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
      </Form>
    </Card>
  )
}

export default MainCard;
