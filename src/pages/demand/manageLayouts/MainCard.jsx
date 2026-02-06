import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import { DemandGlobalContext } from '../../../shared/data/DemandGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';
import CustomSelection from '../../../shared/ui/CustomSelection';
import paymethdemo from './../../../../paymethdem';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';
const MainCard = ({ changeInput, changeSelection }) => {

  const local = useGlobalStore(state => state.local);

  let theme = useTheme();

  const { document, setDocument } = useContext(DemandGlobalContext);
  const [momentModal, setMomentModal] = useState(false);


  return (
    <ManageCard>
      <View style={{
        width: '100%',
        padding: 15,
      }}>
        <Text style={{
          fontSize: 20,
          color: theme.primary
        }}>Satış</Text>
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
          disabled={local.demands.demand.date ? false : true}
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
            placeholder={'Satış novü'}
            title={'Satış növü'}
          />
        </View>
      </View>

    </ManageCard>
  )
}

export default MainCard
