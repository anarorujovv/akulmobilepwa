import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import useTheme from './../theme/useTheme';
import { Pressable } from '@react-native-material/core';

const Input = ({ value, onChange, width, password, placeholder, rightIcon, type, disabled, txPosition, labelButton, onPressLabelButton, isRequired }) => {
  const [active, setActive] = useState(false);
  const theme = useTheme();

  const styles = StyleSheet.create({
    input: {
      borderBottomWidth: !active ? 1 : 2,
      borderColor: !active ? theme.input.grey : theme.primary,
      padding: 0,
      fontSize: 14,
      width: '100%',
      color: theme.input.text,
      textAlign: txPosition ? txPosition : 'left',
    },
    textNonButton: {
      color: theme.input.grey,
      fontSize: 14,
      textAlign: txPosition ? txPosition : 'left',
    },
    text: {
      color: theme.primary,
      fontSize: 14,
      textAlign: txPosition ? txPosition : 'left',
      textDecorationLine: "underline"
    },
  });

  return (
    <View style={{
      width: width,
      height: 50,
      justifyContent: 'flex-end',
    }}>

      {
        labelButton ?
          <Pressable pressEffectColor={theme.primary} onPress={onPressLabelButton}>
            <Text style={[styles.text,{color:isRequired ? 'red' : theme.input.grey}]}>{isRequired ? '*' : ''}</Text>
            <Text style={[styles.text]}>{placeholder}</Text>
          </Pressable>
          :
          <View style={{
            flexDirection:'row'
          }}>
            <Text style={[styles.textNonButton,{color:isRequired ? 'red' : theme.input.grey}]}>{isRequired ? '*' : ''}</Text>
            <Text style={[styles.textNonButton]}>{placeholder}</Text>
          </View>
      }

      <View style={{
        width: '100%',
        flexDirection: 'row'
      }}>
        <TextInput
          editable={!disabled}
          keyboardType={type && type == "number" ? 'numeric' : 'email-address'}
          secureTextEntry={password}
          value={String(value)}
          onChangeText={(e) => {
            if (type == "number") {
              onChange(e.replace(',', '.'));
            }else{
              onChange(e);
            }
            
          }}
          onFocus={() => {
            setActive(true);
          }}
          onBlur={() => {
            setActive(false);
          }}
          cursorColor={theme.primary}
          placeholder='...'
          style={styles.input}
          placeholderTextColor={theme.input.grey}
        />
        <View style={{ marginRight: 10 }} />
        {
          rightIcon
        }
      </View>
    </View>
  );
};

export default Input;
