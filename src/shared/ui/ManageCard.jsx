import { StyleSheet, Text, View } from 'react-native'
import useTheme from '../theme/useTheme'

const ManageCard = ({ customPadding, ...props }) => {

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      elevation: 2,
      shadowColor: theme.black,
      backgroundColor: theme.bg,
      paddingBottom: 50,
      ...customPadding,
    },
  })

  return (
    <View style={[styles.container]}>
      {props.children}
    </View>
  )
}

export default ManageCard

