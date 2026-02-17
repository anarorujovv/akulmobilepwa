import React, { useContext, useState } from 'react';
import { Card, Form, Input, Space } from 'antd-mobile';
import { FaUser } from 'react-icons/fa';
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState';
import CustomersModal from './../../../shared/ui/modals/CustomersModal';
import CashesModal from '../../../shared/ui/modals/CashesModal';
import SpendItemsModal from '../../../shared/ui/modals/SpendItems';
import PaymentMethod from './../../../shared/ui/modals/PaymentMethod';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
import useTheme from '../../../shared/theme/useTheme';

const OppositeCard = ({ cost, changeInput, changeSelection }) => {
  const { document, setDocument, types, setTypes } = useContext(PaymentGlobalContext);
  const theme = useTheme();
  const [spendItemModal, setSpendItemModal] = useState(false);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const local = useGlobalStore(state => state.local);

  return (
    <>
      <Card title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaUser size={18} color={theme.grey} />
          <span>Qarşı-tərəf</span>
        </div>
      }>
        <Space direction='vertical' block>
          <CustomersModal
            returnChanged={changeSelection}
            document={document}
            setDocument={setDocument}
            isDisable={cost}
            width={'100%'}
            isDebtPermission={local.demands.demandToPayment.customerDebt}
          />

          <SpendItemsModal
            types={types}
            target={cost ? 1 : types.direct == 'outs' ? 0 : ''}
            modalVisible={spendItemModal}
            setModalVisible={e => {
              setSpendItemModal(e);
              changeSelection();
            }}
            document={document}
            setDocument={setDocument}
          />

          <CashesModal
            type={types.type}
            returnChanged={changeSelection}
            document={document}
            setDocument={setDocument}
            selectedType={item => {
              let paymentType = types.type;

              if (item.CashType == 'cash') {
                paymentType = 'payment';
              } else if (item.CashType == 'noncash') {
                paymentType = 'invoice';
              } else {
                paymentType = types.type;
              }

              setTypes(rel => ({ ...rel, ['type']: paymentType }));
            }}
          />

          <Form layout='horizontal'>
            <Form.Item label='Məbləğ'>
              <Input
                value={document.Amount}
                onChange={(val) => {
                  changeInput('Amount', val);
                }}
                type='number'
                placeholder='0.00'
              />
            </Form.Item>
          </Form>
        </Space>
      </Card>

      <PaymentMethod
        modalVisible={paymentMethodModal}
        setModalVisible={setPaymentMethodModal}
        setProduct={setTypes}
      />
    </>
  );
};

export default OppositeCard;
