import { Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import Input from '../../../shared/ui/Input'
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState'
import useTheme from '../../../shared/theme/useTheme'
import SelectionDate from '../../../shared/ui/SelectionDate'

const MainCard = ({ changeInput, changeSelection }) => {

  const theme = useTheme();
  const { document, setDocument, types } = useContext(PaymentGlobalContext);
  const [momentModal, setMomentModal] = useState(false);

  return (
    <>
      <ManageCard>
        <View style={{
          width: '100%',
          padding: 15,
        }}>
          <Text style={{
            fontSize: 20,
            color: theme.primary
          }}>{`${types.direct == "ins" ? "Mədaxil" : "Məxaric"} - (${types.type == "payment" ? "nağd" : "köçürmə"})`}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
        </View>
        <View style={{
          width: '100%',
          alignItems: 'center'
        }}>
          <View style={{ margin: 15 }} />
          <Input
            width={'70%'}
            placeholder={'Ad'}
            value={document.Name}
            type={'string'}
            onChange={(e) => {
              changeInput('Name', e)
            }}
          />

          <View style={{ margin: 15 }} />

          <SelectionDate
            change={() => {
              changeSelection();
            }}
            document={document}
            setDocument={setDocument}
            modalVisible={momentModal}
            setModalVisible={setMomentModal}
          />
        </View>
      </ManageCard>

    </>
  )
}

export default MainCard

