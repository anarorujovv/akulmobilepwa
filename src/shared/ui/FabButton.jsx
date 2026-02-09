import React from 'react';
import { IoAdd } from 'react-icons/io5';
import useTheme from './../theme/useTheme';

const FabButton = ({ onPress }) => {
    let theme = useTheme();

    const styles = {
        addButtonContainer: {
            width: 60,
            height: 60,
            borderRadius: 70,
            backgroundColor: theme.pink,
            position: 'fixed',
            bottom: 30,
            right: 20,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            zIndex: 100
        },
        addButton: {
            width: 60,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
        }
    };

    return (
        <div style={styles.addButtonContainer}>
            <button
                style={styles.addButton}
                onClick={onPress}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                <IoAdd size={25} color={theme.bg} />
            </button>
        </div>
    );
};

export default FabButton;
