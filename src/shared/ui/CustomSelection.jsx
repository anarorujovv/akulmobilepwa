import React, { useState } from 'react';
import { Picker, Button } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

const CustomSelection = ({ options, value, onChange, title, placeholder, disabled }) => {
    const [pickerVisible, setPickerVisible] = useState(false);

    // Convert options to picker columns format
    // options format: [{ key: 'value1', value: 'Label 1' }, ...]
    const pickerColumns = [
        options.map(item => ({
            label: item.value,
            value: item.key
        }))
    ];

    const handleConfirm = (val) => {
        if (val && val[0]) {
            onChange(val[0]);
        }
        setPickerVisible(false);
    };

    const selectedLabel = options.find(option => option.key === value)?.value || '';

    return (
        <div style={{ width: '100%' }}>
            <Button
                block
                disabled={disabled}
                onClick={() => !disabled && setPickerVisible(true)}
                style={{
                    '--border-radius': '8px',
                    justifyContent: 'space-between',
                    '--text-color': selectedLabel ? 'var(--adm-color-text)' : 'var(--adm-color-weak)'
                }}
            >
                <span style={{ flex: 1, textAlign: 'left' }}>
                    {selectedLabel || placeholder || title}
                </span>
                <DownOutline style={{ color: 'var(--adm-color-weak)' }} />
            </Button>

            <Picker
                columns={pickerColumns}
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                value={value ? [value] : undefined}
                onConfirm={handleConfirm}
                confirmText='Təsdiq'
                cancelText='Ləğv et'
                title={title}
            />
        </div>
    );
};

export default CustomSelection;
