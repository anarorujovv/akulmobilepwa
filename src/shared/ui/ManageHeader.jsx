import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from '../theme/useTheme';
import IconButton from './IconButton';
import { Pressable } from '@react-native-material/core';
import TempsModal from './modals/TempsModal';
import prompt from '../../services/prompt';

const ManageHeader = ({ navigation, document, print, hasUnsavedChanges, isExcel, isPriceList, onSubmit, type,
  customMenu
}) => {

  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [tempModal, setTempModal] = useState(false);
  const [priceListModal, setPriceListModal] = useState(false);

  const styles = StyleSheet.create({
    top: {
      width: '100%',
      height: 55,
      backgroundColor: theme.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
      backgroundColor: theme.stable.white,
      padding: 20,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.input.greyWhite,
      padding: 15,
      marginVertical: 10,
      borderRadius: 8,
    },
    paymentIcon: {
      marginRight: 10,
    },
    paymentText: {
      fontSize: 18,
      color: theme.textColor,
      fontWeight: '600',
    },
  });

  const handleMenuClick = async (action) => {

    let id = null
    if (document.Id && !hasUnsavedChanges) {
      id = document.Id
    } else {
      if (onSubmit) {
        id = await onSubmit();
      }
      if (id == null) {
        setMenuVisible(false);
      }
    }

    if (id) {
      switch (action) {
        case 'Print':
          setTempModal(true);
          setMenuVisible(false);
          break;
        case 'Excel':
          break;
        case 'PriceList':
          setPriceListModal(true);
          setMenuVisible(false);
          break;
      }
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      prompt('Çıxmağa əminsiniz ?', () => {
        navigation.goBack();
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.top}>
      <IconButton onPress={handleBack} size={40}>
        <Ionicons name="arrow-back" size={25} color={theme.stable.white} />
      </IconButton>

      <IconButton onPress={() => setMenuVisible(true)} size={40}>
        <Ionicons name="ellipsis-vertical" size={25} color={theme.stable.white} />
      </IconButton>

      {/* Ana Menu */}

      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
          style={styles.modalContainer}
        >
          <TouchableOpacity activeOpacity={1} style={styles.menuContainer}>
            {isExcel && (
              <Pressable
                pressEffectColor={theme.input.greyWhite}
                style={styles.paymentOption}
                onPress={() => handleMenuClick('Excel')}
              >
                <MaterialCommunityIcon name="microsoft-excel" size={20} color={theme.green} />
                <Text style={styles.paymentText}>Excel</Text>
              </Pressable>
            )}

            {print && (
              <Pressable
                pressEffectColor={theme.input.greyWhite}
                style={styles.paymentOption}
                onPress={() => handleMenuClick('Print')}
              >
                <Ionicons name="print" size={20} color={theme.primary} />
                <Text style={styles.paymentText}>Print</Text>
              </Pressable>
            )}
            {isPriceList && (
              <Pressable
                pressEffectColor={theme.input.greyWhite}
                style={styles.paymentOption}
                onPress={() => handleMenuClick('PriceList')}
              >
                <Ionicons name="cash" size={20} color={theme.primary} />
                <Text style={styles.paymentText}>Price List</Text>
              </Pressable>
            )}

            {customMenu && customMenu.map((item) => {
              return (
                <Pressable
                  pressEffectColor={theme.input.greyWhite}
                  style={styles.paymentOption}
                  onPress={() => item.onPress()}
                >
                  <Ionicons name={item.icon} size={20} color={theme.primary} />
                  <Text style={styles.paymentText}>{item.name}</Text>
                </Pressable>
              )
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <TempsModal
        modalVisible={tempModal}
        setModalVisible={setTempModal}
        navigation={navigation}
        document={document}
        name={print}
        type={type}
      />

      <TempsModal
        modalVisible={priceListModal}
        setModalVisible={setPriceListModal}
        navigation={navigation}
        document={document}
        name={'products'}
        priceList={true}
      />
    </View>
  );
};

export default ManageHeader;
