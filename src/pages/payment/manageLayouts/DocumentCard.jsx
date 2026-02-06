import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import ManageCard from '../../../shared/ui/ManageCard'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Input from '../../../shared/ui/Input'
import useTheme from '../../../shared/theme/useTheme'
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState'

const DocumentCard = ({ cost,changeInput }) => {

  const { document, setDocument } = useContext(PaymentGlobalContext);


  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      padding: 15,
    },
  })

  return (
    <ManageCard>

      <View style={styles.header}>
        <MaterialIcons name='insert-drive-file' size={20} />
        <Text>Digər</Text>
      </View>

      <View style={{
        width:'100%',
        alignItems:'center'
      }}>
        <Input value={document.Description} placeholder={'Açıqlama'} onChange={(e) => {
          changeInput('Description',e)

        }} type={'string'} width={'70%'} />
      </View>
    </ManageCard>
  )
}

export default DocumentCard
