import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme';
import useGlobalStore from '../data/zustand/useGlobalStore';
import permission_ver from '../../services/permissionVerification';

const DocumentInfo = ({ data }) => {

  let theme = useTheme();
  let permissions = useGlobalStore(state => state.permissions);

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      flexWrap: 'wrap'
    },
    line: {
      width: 30,
      height: 2,
      backgroundColor: theme.primary
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'row',
      borderRadius: 5,
      gap: 5,
    },
    text: {
      fontSize: 12,
      color: theme.input.grey
    },
    balanceSection: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    balanceTitle: {
      fontSize: 12,
      color: theme.grey,
      marginBottom: 1,
    },
    balanceValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.black,
    },
  })

  const renderItem = (item, index) => {
    switch (item.title) {
      case "Maya":
        return (
          permission_ver(permissions, 'profit', 'D') &&
          <View style={styles.balanceSection}>
            <Text style={styles.balanceTitle}>{item.title}</Text>
            <Text style={styles.balanceValue}>{item.value}</Text>
          </View>
        )
      case "Qazanc":
        return (
          permission_ver(permissions,'profit','D') &&
          <View style={styles.balanceSection}>
            <Text style={styles.balanceTitle}>{item.title}</Text>
            <Text style={styles.balanceValue}>{item.value}</Text>
          </View>
        )
      default:
        return (
          <View style={styles.balanceSection}>
            <Text style={styles.balanceTitle}>{item.title}</Text>
            <Text style={styles.balanceValue}>{item.value}</Text>
          </View>
        )
    }
  }

  return (
    <View style={{
      width: '100%',
      height: 70,
    }}>
      <ScrollView
        horizontal
      >

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          gap: 50,
          paddingLeft: 10,
          paddingRight: 10,
          minWidth: '100%'
        }}>

          {
            data.map((item, index) => {
              return (
                renderItem(item, index)
              )
            })
          }
        </View>
      </ScrollView>

    </View>
  )
}

export default DocumentInfo
