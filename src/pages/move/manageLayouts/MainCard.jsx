import React, { useContext, useState } from 'react';
import { Card, Input, Form, DatePicker } from 'antd-mobile';
import { MoveGlobalContext } from '../../../shared/data/MoveGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import moment from 'moment';

const MainCard = ({ changeInput, changeSelection }) => {

  const theme = useTheme();

  const { document, setDocument } = useContext(MoveGlobalContext);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  if (!document) return null;

  return (
    <Card title={<span style={{ fontSize: 16, fontWeight: 'bold', color: theme.primary }}>Yerdəyişmə</span>}>
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

        <Form.Item label='Tarix' onClick={() => setDatePickerVisible(true)}>
          <div style={{ padding: '4px 0', fontSize: 15 }}>
            {moment(document.Moment).format('YYYY-MM-DD HH:mm')}
          </div>
        </Form.Item>
      </Form>

      <DatePicker
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        defaultValue={new Date(document.Moment)}
        onConfirm={(val) => {
          changeSelection('Moment', moment(val).format('YYYY-MM-DD HH:mm:ss'))
        }}
      />
    </Card>
  )
}

export default MainCard;
