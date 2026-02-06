import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';
import { CustomerOrderGlobalContext } from '../../../shared/data/CustomerOrderGlobalState';
import CustomSelection from '../../../shared/ui/CustomSelection';
import paymethdemo from './../../../../paymethdem';
import Button from '../../../shared/ui/Button';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainCard = ({ changeInput, changeSelection }) => {

  let theme = useTheme();

  const { document, setDocument } = useContext(CustomerOrderGlobalContext);
  const [momentModal, setMomentModal] = useState(false);

  const [isImplementLoading, setIsImplementLoading] = useState(false);

  const handleImplement = async () => {
    setIsImplementLoading(true);
    await api(`customerorders/todemand.php`, {
      documentid: document.Id,
      token: await AsyncStorage.getItem('token')
    })

    setIsImplementLoading(false);
  }

  return (
    <ManageCard>
      <View style={{
        width: '100%',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 20,
          color: theme.primary
        }}>Sifariş</Text>

        {document && document.Id && (
          <Button
            onClick={handleImplement}
            width={'40%'}
            bg={theme.primary}
            isLoading={isImplementLoading}
          >
            Təstiqlə
          </Button>
        )}
      </View>
      <View style={{
        marginTop: 20,
        gap: 20,
        alignItems: 'center'
      }}>
        <Input
          placeholder={'Ad'}
          type={'string'}
          width={'70%'}
          value={document.Name}
          onChange={(e) => {
            changeInput('Name', e);
          }}
        />

        <SelectionDate
          change={changeSelection}
          document={document}
          setDocument={setDocument}
          modalVisible={momentModal}
          setModalVisible={setMomentModal}
        />

        <View style={{
          width: '70%'
        }}>
          <CustomSelection
            value={document.PaymentMethod}
            options={paymethdemo}
            onChange={(e) => {
              changeSelection('PaymentMethod', e);
            }}
            placeholder={'Sifariş novü'}
            title={'Sifariş növü'}
          />
        </View>
      </View>

    </ManageCard>
  )
}

export default MainCard
