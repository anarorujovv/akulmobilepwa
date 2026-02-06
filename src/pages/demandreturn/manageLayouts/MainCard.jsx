import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import { Pressable } from '@react-native-material/core';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { DemandReturnGlobalContext } from '../../../shared/data/DemandReturnGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';

const MainCard = ({ changeInput, changeSelection }) => {

  const local = useGlobalStore(state => state.local);

  const { document, setDocument } = useContext(DemandReturnGlobalContext);
  const [momentModal, setMomentModal] = useState(false);

  let theme = useTheme();

  return (
    <ManageCard>
      <View style={{
        width: '100%',
        padding: 15,
      }}>
        <Text style={{
          fontSize: 20,
          color: theme.primary
        }}>Satış iadəsi</Text>
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
            changeInput('Name', e)
          }}
        />

        <SelectionDate
          disabled={local.demands.demandReturn.date ? false : true}
          change={changeSelection}
          document={document}
          setDocument={setDocument}
          modalVisible={momentModal}
          setModalVisible={setMomentModal}
        />

      </View>

    </ManageCard>
  )
}

export default MainCard
