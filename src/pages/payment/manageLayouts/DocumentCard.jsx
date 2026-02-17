import React, { useContext } from 'react';
import { Card, Form, TextArea } from 'antd-mobile';
import { MdInsertDriveFile } from 'react-icons/md';
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState';

const DocumentCard = ({ cost, changeInput }) => {
  const { document } = useContext(PaymentGlobalContext);

  return (
    <Card title={
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MdInsertDriveFile size={20} />
        <span>Digər</span>
      </div>
    }>
      <Form layout='horizontal'>
        <Form.Item label='Açıqlama'>
          <TextArea
            value={document.Description}
            placeholder='Açıqlama daxil edin'
            onChange={(val) => {
              changeInput('Description', val);
            }}
            rows={2}
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DocumentCard;
