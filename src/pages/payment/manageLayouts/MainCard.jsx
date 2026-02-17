import React, { useContext, useState } from 'react';
import { Card, Input, Form, DatePicker } from 'antd-mobile';
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState';
import moment from 'moment';

const MainCard = ({ changeInput, changeSelection, type, direct }) => {
  const { document, setDocument, types } = useContext(PaymentGlobalContext);
  const [pickerVisible, setPickerVisible] = useState(false);

  // Derive title from props or context (props passed from parent are reliable)
  // types is from context, usually synced.
  const title = `${types.direct == "ins" ? "Mədaxil" : "Məxaric"} - (${types.type == "payment" ? "nağd" : "köçürmə"})`;

  return (
    <Card title={title}>
      <Form layout='horizontal' footer={null}>
        <Form.Item label='Sənəd Adı'>
          <Input
            value={document.Name}
            onChange={(val) => {
              changeInput('Name', val);
            }}
            placeholder='Ad'
          />
        </Form.Item>
        <Form.Item label='Tarix' onClick={() => setPickerVisible(true)} clickable>
          {/* Display formatted date */}
          {document.Moment ? moment(document.Moment).format('YYYY-MM-DD HH:mm') : 'Tarix seçin'}
        </Form.Item>
      </Form>

      <DatePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        defaultValue={document.Moment ? new Date(document.Moment) : new Date()}
        precision='minute'
        onConfirm={(val) => {
          setDocument(prev => ({ ...prev, Moment: moment(val).format('YYYY-MM-DD HH:mm:ss') }));
          changeSelection();
        }}
        confirmText='Təsdiq'
        cancelText='Ləğv'
      />
    </Card>
  );
};

export default MainCard;
