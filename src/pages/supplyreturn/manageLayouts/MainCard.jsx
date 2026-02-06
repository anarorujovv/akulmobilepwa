import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import { Pressable } from '@react-native-material/core';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { SupplyReturnGlobalContext } from '../../../shared/data/SupplyReturnGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';

const MainCard = ({ changeInput, changeSelection }) => {

  let theme = useTheme();

  const { document, setDocument } = useContext(SupplyReturnGlobalContext);
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
        }}>Alış iadəsi</Text>
      </View>

      <View style={{
        marginTop: 20,
        gap: 20,
        alignItems: 'center'
      }}>

        <Input
          isRequired={true}
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
          modalVisible={momentModal}
          setModalVisible={setMomentModal}
          document={document}
          setDocument={setDocument}
        />
      </View>
    </ManageCard>
  )
}

export default MainCard
