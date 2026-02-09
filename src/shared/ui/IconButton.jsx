import React from 'react';
import useTheme from '../theme/useTheme';

const IconButton = ({ size, onPress, disabled, ...props }) => {
    const theme = useTheme();

    const styles = {
        container: {
            borderRadius: size,
            width: size,
            height: size,
            overflow: 'hidden'
        },
        button: {
            width: size,
            height: size,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'background-color 0.2s ease'
        }
    };

    const handleMouseEnter = (e) => {
        if (!disabled) {
            e.target.style.backgroundColor = theme.input.grey;
        }
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = 'transparent';
    };

    return (
        <div style={styles.container}>
            <button
                disabled={disabled}
                onClick={onPress}
                style={styles.button}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {props.children}
            </button>
        </div>
    );
};

export default IconButton;