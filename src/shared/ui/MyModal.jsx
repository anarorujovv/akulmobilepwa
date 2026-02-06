import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import useTheme from '../theme/useTheme'

const MyModal = ({ modalVisible, setModalVisible, width, height,
  center, position,
  ...props }) => {
  let theme = useTheme();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      backgroundColor:'rgba(0,0,0,0.2)'
    },
    modalView: {
      position: 'absolute',
      backgroundColor: theme.stable.white,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: theme.pink,
    },
    buttonClose: {
      backgroundColor: theme.primary,
      textStyle: {
        color: theme.stable.white,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: theme.black,
      },
    }
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(false);
        }}
        activeOpacity={1}
        style={[styles.centeredView, center != undefined ? { justifyContent: 'center', alignItems: 'center' } : ""]}>
        <TouchableOpacity onPress={() => { }}
          activeOpacity={1}
          style={[styles.modalView, {
            width,
            height,
          }, position != undefined ? { ...position } : ""]}>
        {
          props.children
        }
      </TouchableOpacity>
    </TouchableOpacity>
    </Modal >
  )
}

export default MyModal

