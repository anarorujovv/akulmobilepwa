import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Input from './Input';
import { Pressable } from '@react-native-material/core';

const SelectionDate = ({ modalVisible, setModalVisible, document, setDocument, change, disabled }) => {

    return (
        <>
            <Pressable
                disabled={disabled}
                style={{
                    width: '100%',
                    alignItems: 'center'
                }}
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <Input
                    disabled={true}
                    placeholder={'Tarix'}
                    type={'string'}
                    width={'70%'}
                    value={document.Moment}
                />
            </Pressable>

            <DatePicker
                mode='date'
                modal
                open={modalVisible}
                date={document.Moment == "" ? new Date() : new Date(moment(document.Moment).format('YYYY-MM-DD HH:mm:ss'))}
                onConfirm={(date) => {
                    if (change) {
                        change(date)
                    }
                    let dateMoment = moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
                    setDocument(rel => ({ ...rel, ['Moment']: dateMoment }))
                    setModalVisible(false);
                }}
                onCancel={() => {
                    setModalVisible(false);
                }}
                confirmText='Tarixi seç'
                cancelText='Bağla'
            />
        </>
    )
}

export default SelectionDate

const styles = StyleSheet.create({})