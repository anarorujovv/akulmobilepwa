import React, { useState } from 'react';
import moment from 'moment';
import { DatePicker, List } from 'antd-mobile';

const SelectionDate = ({ modalVisible, setModalVisible, document, setDocument, change, disabled }) => {

    const labelRenderer = (type, data) => {
        switch (type) {
            case 'year':
                return data + ' il'
            case 'month':
                return data + ' ay'
            case 'day':
                return data + ' gün'
            case 'hour':
                return data + ' saat'
            case 'minute':
                return data + ' dəqiqə'
            default:
                return data
        }
    }

    return (
        <>
            <div
                onClick={() => {
                    if (!disabled) {
                        setModalVisible(true)
                    }
                }}
                style={{
                    textAlign: 'right',
                    width: '100%',
                    color: document.Moment ? 'inherit' : '#ccc',
                    cursor: 'pointer',
                    fontSize: '17px'
                }}
            >
                {document.Moment ? moment(document.Moment).format('YYYY-MM-DD HH:mm') : 'Seçin'}
            </div>

            <DatePicker
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false)
                }}
                precision='minute'
                onConfirm={val => {
                    const dateMoment = moment(val).format('YYYY-MM-DD HH:mm:ss');
                    if (change) {
                        change(new Date(dateMoment));
                    }
                    setDocument(rel => ({ ...rel, ['Moment']: dateMoment }));
                }}
                renderLabel={labelRenderer}
                title='Tarix seçimi'
            />
        </>
    );
};

export default SelectionDate;