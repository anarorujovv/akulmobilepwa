import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from './Input'
import moment from 'moment';
import Button from './Button';
import DatePicker from 'react-native-date-picker';
import { Pressable } from '@react-native-material/core';

const DateRangePicker = ({
  submit,
  width,
  filter,
  setFilter
}) => {

  let [firstDate, setFirstData] = useState(null);
  let [lastDate, setLastDate] = useState(null)

  let [firstDateModal, setFirstDateModal] = useState(false);
  let [lastDateModal, setLastDateModal] = useState(false);

  const handleConfirmFirstDate = (date) => {

    setFirstDateModal(false);
    if (!submit) {
      setFilter(rel => ({ ...rel, ['momb']: moment(date).format("YYYY-MM-DD 00:00:00") }))
    }
    setFirstData(date);
  }

  const handleConfirmLastDate = (date) => {

    setLastDateModal(false);
    if (!submit) {
      setFilter(rel => ({ ...rel, ['mome']: moment(date).format('YYYY-MM-DD 23:59:59') }))
    }
    setLastDate(date);
  }

  const onSubmit = (firstDate, lastDate) => {
    if (firstDate != null) {
      setFilter(rel => ({ ...rel, ['momb']: moment(firstDate).format("YYYY-MM-DD 00:00:00") }))
    }
    if (lastDate != null) {
      setFilter(rel => ({ ...rel, ['mome']: moment(lastDate).format('YYYY-MM-DD 23:59:59') }))
    }
  }


  const fetchingMomentData = () => {
    let filterObject = { ...filter };
    if (filterObject.momb && filterObject.mome) {
      setFirstData(new Date(filterObject.momb))
      setLastDate(new Date(filterObject.mome))
    } else {
      setFirstData(null)
      setLastDate(null)
    }
  }
  
  useEffect(() => {
    fetchingMomentData();
  }, [])

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: width
    }}>

      <Pressable
        style={{
          width: submit ? '40%' : '50%'
        }}
        onPress={() => {
          setFirstDateModal(true);
        }}
      >

        <Input
          width={'100%'}
          value={firstDate == null ? "" : moment(firstDate).format('DD-MM-YYYY 00:00')}
          disabled={true}
          type={'number'}
          placeholder={'Başlama Tarixi'} />
      </Pressable>


      <Pressable style={{
        width: submit ? '40%' : "50%"
      }}
        onPress={() => {
          setLastDateModal(true)
        }}
      >
        <Input
          width={'100%'}
          value={lastDate == null ? "" : moment(lastDate).format('DD-MM-YYYY 23:59')}
          disabled={true}
          type={'number'}
          placeholder={'Bitmə Tarixi'} />
      </Pressable>
      {
        submit ?
          <Button
            width={'20%'}
            onClick={() => {
              onSubmit(firstDate, lastDate);
            }}
          >
            Axtar
          </Button>
          :
          ""
      }

      <DatePicker
        mode='date'
        date={firstDate == null ? new Date() : firstDate}
        modal
        open={firstDateModal}
        onConfirm={handleConfirmFirstDate}
        onCancel={() => {
          setFirstDateModal(false)
        }}
        confirmText='Yadda Saxla'
        cancelText='Ləğv et'
      />

      <DatePicker
        date={lastDate == null ? new Date() : lastDate}
        modal
        open={lastDateModal}
        onConfirm={handleConfirmLastDate}
        onCancel={() => {
          setLastDateModal(false)
        }}
        mode='date'
      />

    </View>
  )

}

export default DateRangePicker
