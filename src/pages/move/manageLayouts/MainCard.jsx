import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';
import { MoveGlobalContext } from '../../../shared/data/MoveGlobalState';
const MainCard = ({ changeInput, changeSelection }) => {

  let theme = useTheme();

  const { document, setDocument } = useContext(MoveGlobalContext);
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
        }}>Yerdəyişmə</Text>
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
            changeInput('Name',e);
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
