import React from 'react';
import useTheme from '../theme/useTheme';

const MySwitch = ({
    value,
    onChange,
    text,
    width,
    disabled
}) => {

    let theme = useTheme();

    const styles = {
        container: {
            width: width || '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0'
        },
        text: {
            color: theme.grey,
            fontSize: 14,
            margin: 0
        },
        switch: {
            cursor: disabled ? 'not-allowed' : 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <span style={styles.text}>{text}</span>
            <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                style={styles.switch}
            />
        </div>
    );
};

export default MySwitch;