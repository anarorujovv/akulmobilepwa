import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import useTheme from '../../../shared/theme/useTheme';
import Input from '../../../shared/ui/Input';
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState';
import { Pressable } from '@react-native-material/core';
import CustomersModal from './../../../shared/ui/modals/CustomersModal';
import CashesModal from '../../../shared/ui/modals/CashesModal';
import SpendItemsModal from '../../../shared/ui/modals/SpendItems';
import PaymentMethod from './../../../shared/ui/modals/PaymentMethod';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';

const OppositeCard = ({ cost, changeInput, changeSelection }) => {
  const theme = useTheme();
  const { document, setDocument, types, setTypes } =
    useContext(PaymentGlobalContext);

  const [spendItemModal, setSpendItemModal] = useState(false);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const local = useGlobalStore(state => state.local);

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      flexDirection: 'row',
      padding: 20,
      alignItems: 'center',
      gap: 10,
    },
  });

  return (
    <>
      <ManageCard>
        <View style={styles.header}>
          <FontAwesome6 name="user-large" size={20} color={theme.grey} />
          <Text
            style={{
              color: theme.grey,
            }}>
            Qarşı-tərəf
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            alignItems: 'center',
            gap: 10,
          }}>
          <CustomersModal
            returnChanged={changeSelection}
            document={document}
            setDocument={setDocument}
            isDisable={cost}
            width={'70%'}
            isDebtPermission={local.demands.demandToPayment.customerDebt}
          />

          {/* <Pressable
                        style={{
                            width: '100%',
                            alignItems: "center"
                        }}
                        onPress={() => {
                            setPaymentMethodModal(true)
                            changeSelection();
                        }}
                    >
                        <Input
                            width={'70%'}
                            disabled={true}
                            value={types.type == "payment" ? "Nağd" : "Köçürmə"}
                            placeholder={"Ödəniş növü"}
                        />

                    </Pressable> */}

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

          <Input
            width={'70%'}
            placeholder={'Məbləğ'}
            value={document.Amount}
            type={'number'}
            onChange={e => {
              changeInput('Amount', e);
            }}
          />
        </View>
      </ManageCard>

      <PaymentMethod
        modalVisible={paymentMethodModal}
        setModalVisible={setPaymentMethodModal}
        setProduct={setTypes}
      />
    </>
  );
};

export default OppositeCard;
