import React, { useEffect, useState } from 'react';
import { Picker, Button, SpinLoading } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import api from '../../services/api';
import AsyncStorage from '../../services/AsyncStorageWrapper';
import ErrorMessage from './RepllyMessage/ErrorMessage';

const Selection = ({
    value,
    apiName,
    title,
    defaultValue,
    apiBody,
    change,
    bottomTitle,
    bottomText,
    isRequired,
    searchApi,
    searchKey,
    disabled
}) => {
    const [info, setInfo] = useState([]);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchingData = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const element = await api(apiName, {
                ...apiBody,
                token: token,
            });

            if (element != null && element.List && element.List[0]) {
                let list = [...element.List];
                if (defaultValue) {
                    setSelectedValue(defaultValue);
                } else {
                    let index = list.findIndex(rel => rel.Id == value);
                    if (index !== -1) {
                        setSelectedValue(list[index].Name);
                    }
                }
                setInfo(list);
            } else {
                setInfo([]);
            }
        } catch (err) {
            ErrorMessage(err);
            setInfo([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (info.length > 0) {
            const selected = info.find(rel => rel.Id == value);
            if (selected) {
                setSelectedValue(selected.Name);
            } else if (!value && !defaultValue) {
                setSelectedValue('');
            }
        } else if (!value && !defaultValue) {
            setSelectedValue('');
        }
    }, [value, info, defaultValue]);

    // Convert info to picker columns format
    const pickerColumns = [
        info.map(item => ({
            label: item.Name,
            value: item.Id?.toString() || item.Name
        }))
    ];

    const handleConfirm = (val) => {
        if (val && val[0]) {
            const selectedItem = info.find(item =>
                (item.Id?.toString() || item.Name) === val[0]
            );
            if (selectedItem) {
                setSelectedValue(selectedItem.Name);
                if (change) {
                    change(selectedItem);
                }
            }
        }
        setPickerVisible(false);
    };

    if (loading) {
        return (
            <div style={{
                width: '100%',
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <SpinLoading color='primary' style={{ '--size': '24px' }} />
            </div>
        );
    }

    if (info.length === 0) {
        return (
            <Button
                block
                disabled
                style={{
                    '--border-radius': '8px',
                    justifyContent: 'space-between'
                }}
            >
                <span style={{ color: 'var(--adm-color-weak)' }}>
                    {title} - Məlumat yoxdur
                </span>
            </Button>
        );
    }

    return (
        <div style={{ width: '100%' }}>
            <Button
                block
                disabled={disabled}
                onClick={() => !disabled && setPickerVisible(true)}
                style={{
                    '--border-radius': '8px',
                    justifyContent: 'space-between',
                    '--text-color': selectedValue ? 'var(--adm-color-text)' : 'var(--adm-color-weak)'
                }}
            >
                <span style={{ flex: 1, textAlign: 'left' }}>
                    {selectedValue || title}
                </span>
                <DownOutline style={{ color: 'var(--adm-color-weak)' }} />
            </Button>

            {bottomText !== undefined && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    fontSize: 12
                }}>
                    <span style={{ color: 'var(--adm-color-warning)' }}>{bottomTitle}</span>
                    <span style={{
                        color: bottomText >= 0 ? 'var(--adm-color-text)' : 'var(--adm-color-success)'
                    }}>
                        {bottomText} ₼
                    </span>
                </div>
            )}

            <Picker
                columns={pickerColumns}
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                value={value ? [value.toString()] : undefined}
                onConfirm={handleConfirm}
                confirmText='Təsdiq'
                cancelText='Ləğv et'
                title={title}
            />
        </div>
    );
};

export default Selection;