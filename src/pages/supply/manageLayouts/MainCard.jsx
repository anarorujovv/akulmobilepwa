import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import { SupplyGlobalContext } from '../../../shared/data/SupplyGlobalState';
import Input from '../../../shared/ui/Input';
import { Pressable } from '@react-native-material/core';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';

const MainCard = ({ id, changeInput, changeSelection }) => {

  const { document, setDocument } = useContext(SupplyGlobalContext);
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
        }}>Alış</Text>
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

      </View>

    </ManageCard>
  )
}

export default MainCard
