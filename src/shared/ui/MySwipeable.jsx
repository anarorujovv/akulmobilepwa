import React from 'react';
import useTheme from '../theme/useTheme';
import { AiOutlineDelete } from 'react-icons/ai';

const MySwipeable = ({ onPress, ...props }) => {

    let theme = useTheme();

    const styles = {
        container: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
        },
        content: {
            flex: 1
        },
        deleteButton: {
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.red // İkon rengi olarak kullanacağız
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {props.children}
            </div>
            {onPress && (
                <button
                    style={styles.deleteButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPress();
                    }}
                    title="Sil"
                >
                    <AiOutlineDelete size={20} color={theme.red} />
                </button>
            )}
        </div>
    );
};

export default MySwipeable;
