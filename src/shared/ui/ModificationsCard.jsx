import React, { useEffect, useState } from 'react';
import ManageCard from './ManageCard';
import useTheme from '../theme/useTheme';
import fetchModifications from '../../services/fetchModifications';
import { MdFormatListBulleted } from 'react-icons/md';
import { AiOutlineDown, AiOutlineUp, AiFillEdit, AiOutlineEdit } from 'react-icons/ai';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import CustomSelection from './CustomSelection';
import MyModal from './MyModal';
import Input from './Input';
import Button from './Button';

const ModificationsCard = ({ target, state, setState, hasUnsavedChanged }) => {

  const theme = useTheme();



  const styles = {
    header: {
      width: '100%',
      padding: 15,
      gap: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10
    },
    headerText: {
      color: theme.grey
    },
    row: {
      width: '70%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10
    },
    editButton: {
      width: 30,
      height: 30,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    modalContent: {
      width: '100%',
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10
    }
  };


  const [modifications, setModifications] = useState([]);
  const [isCollapse, setIsCollapse] = useState(false);
  const [refs, setRefs] = useState(null);
  const [isEditMod, setIsEditMod] = useState({
    visible: false,
    target: null
  });
  const [isEditModValue, setIsEditModValue] = useState('');


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
        token: await AsyncStorageWrapper.getItem('token')
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

  if (!state) return null;

  return (
    <ManageCard
      customPadding={{
        paddingTop: 10,
        alignItems: 'center',
        gap: 10,
        paddingBottom: 10
      }}
    >
      <div
        onClick={() => {
          setIsCollapse(rel => !rel);
        }}
        style={styles.header}>
        <div style={styles.headerContent}>
          <MdFormatListBulleted size={20} color={theme.grey} />
          <span style={styles.headerText}>Modifikasiylar</span>
        </div>
        {isCollapse ?
          <AiOutlineUp color={theme.primary} size={20} /> :
          <AiOutlineDown color={theme.primary} size={20} />
        }
      </div>
      {
        isCollapse ?
          refs != null ?
            modifications[0] ?
              modifications.map((element, index) => {
                return (
                  <div key={index} style={styles.row}>
                    <CustomSelection
                      options={refs[element.Column].map(rel => ({ key: rel || "", value: rel || "" }))}
                      onChange={(e) => {
                        handleChangeModification(e, element.Column)
                      }}
                      placeholder={element.Title}
                      title={"Modifikasiya"}
                      value={state.Modifications[0][element.Column] || ''}
                    />
                    <button style={styles.editButton}
                      onClick={() => {
                        setIsEditMod({
                          visible: true,
                          target: element.Column
                        })
                        setIsEditModValue(state.Modifications[0][element.Column] || '')
                      }}
                    >
                      <AiOutlineEdit size={25} color={theme.primary} />
                    </button>
                  </div>
                )
              })

              :
              <div style={styles.loadingContainer}>
                <div className="spinner"></div>
              </div>
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
          setIsEditMod(_ => ({ target: null, visible: e }))
          setIsEditModValue('');
        }}
      >
        <div style={styles.modalContent}>
          <Input
            width={'70%'}
            placeholder={isEditMod.target}
            value={isEditModValue}
            onChange={(e) => {
              setIsEditModValue(e)
            }}
          />
          <Button width={'70%'} onClick={() => {
            let targetState = { ...refs };
            let index = targetState[isEditMod.target].findIndex(rel => rel == isEditModValue);
            if (index == -1) {
              targetState[isEditMod.target].push(isEditModValue);
            }
            handleChangeModification(isEditModValue, isEditMod.target);
            setRefs(targetState);
            setIsEditMod({
              visible: false,
              target: null
            })
          }}>
            Yadda Saxla
          </Button>
        </div>
      </MyModal>
    </ManageCard>
  )
}

export default ModificationsCard
