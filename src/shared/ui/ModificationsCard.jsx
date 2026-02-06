import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ManageCard from './ManageCard'
import useTheme from '../theme/useTheme';
import fetchModifications from '../../services/fetchModifications';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Pressable } from '@react-native-material/core';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSelection from './CustomSelection';
import MyModal from './MyModal';
import Input from './Input';
import Button from './Button';

const ModificationsCard = ({ target, state, setState, hasUnsavedChanged }) => {

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      padding: 15,
      gap: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  })

  const theme = useTheme();

  const [modifications, setModifications] = useState([]);
  const [isCollapse, setIsCollapse] = useState(false);
  const [refs, setRefs] = useState(null);
  const [isEditMod, setIsEditMod] = useState({
    visible:false,
    target:null
  });
  const [isEditModValue,setIsEditModValue] = useState('');


  const initializeApp = async () => {

    let result = await fetchModifications(target);
    // https://api.akul.az/1.0/dev/controllers/modification/get.php

    //   {
    //     "column": "cole_brend",
    //     "target": "product",
    //     "modification": "",
    //     "token": "d04999b8d40d08be202aeaf07d77b8f5"
    // }

    let obj = {};

    await Promise.all(result.map(async element => {
      await api('/modification/get.php', {
        column: element.Column,
        target: element.Target,
        modification: "",
        token: await AsyncStorage.getItem('token')
      }).then(res => {
        obj[element.Column] = res.List.filter(item => item != null);
      })
    })).then(() => {
      setRefs(obj);
      setModifications(result);
    }).catch(err => { console.log(err) })

  }

  const handleChangeModification = (txt, type) => {
    let targetState = { ...state };
    targetState.Modifications[0][type] = txt;
    setState(targetState);
    hasUnsavedChanged(true)
  }

  useEffect(() => {
    if (modifications[0]) {
      setModifications([]);
    }
    initializeApp(target);
  }, [target])

  return (
    <ManageCard
      customPadding={{
        paddingTop: 10,
        alignItems: 'center',
        gap: 10,
        paddingBottom: 10
      }}
    >
      <Pressable
        onPress={() => {
          setIsCollapse(rel => !rel);
        }}
        style={styles.header}>
        <View style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 10
        }}>
          <MaterialCommunityIcon size={20} color={theme.grey} name='format-list-text' />
          <Text style={{
            color: theme.grey
          }}>Modifikasiylar</Text>
        </View>
        <AntDesign name={isCollapse ? 'up' : 'down'} color={theme.primary} size={20} />
      </Pressable>
      {
        isCollapse ?
          refs != null ?
            modifications[0] ?
              modifications.map((element, index) => {
                return (
                  <View style={{
                    width: '70%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <CustomSelection
                      options={refs[element.Column].map(rel => ({ key: rel || "", value: rel || "" }))}
                      onChange={(e) => {
                        handleChangeModification(e, element.Column)
                      }}
                      placeholder={element.Title}
                      title={"Modifikasiya"}
                      value={state.Modifications[0][element.Column] || ''}
                    />
                    <TouchableOpacity style={{
                      width: 30,
                      height: 30,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                      onPress={() => {
                        setIsEditMod({
                          visible:true,
                          target:element.Column
                        })
                        setIsEditModValue(state.Modifications[0][element.Column] || '')
                      }}
                    >
                      <MaterialCommunityIcon name='lead-pencil' size={25} color={theme.primary} />
                    </TouchableOpacity>
                  </View>
                )
              })

              :
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ActivityIndicator size={30} color={theme.primary} />
              </View>
            :
            ""
          :
          ""
      }

      <MyModal
        center={true}
        modalVisible={isEditMod.visible}
        height={200}
        width={'70%'}
        setModalVisible={(e) => {
          setIsEditMod(_ => ({target:null,visible:e}))
          setIsEditModValue('');
        }}
      >
        <View style={{
          width:'100%',
          height:200,
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <Input
          width={'70%'}
            placeholder={isEditMod.target}
            value={isEditModValue}
            onChange={(e) => {
              setIsEditModValue(e)
            }}
          />
          <View style={{margin:5}}/>
          <Button width={'70%'} onClick={() => {
            let targetState = {...refs};
            let index = targetState[isEditMod.target].findIndex(rel => rel == isEditModValue);
            if(index == -1){
              targetState[isEditMod.target].push(isEditModValue);
            }
            handleChangeModification(isEditModValue,isEditMod.target);
            setRefs(targetState);
            setIsEditMod({
              visible:false,
              target:null
            })
          }}>
            Yadda Saxla
          </Button>
        </View>
      </MyModal>
    </ManageCard>
  )
}

export default ModificationsCard
