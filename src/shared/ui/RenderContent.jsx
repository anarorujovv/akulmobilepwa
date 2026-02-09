import React from 'react';
import useTheme from '../theme/useTheme';

const RenderContent = ({ data, ...props }) => {
    let theme = useTheme();

    const styles = {
        centerContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            padding: 20
        },
        textPrimary: {
            color: theme.primary,
            fontSize: 16
        },
        textError: {
            color: theme.red,
            fontSize: 16
        }
    };

    return (
        typeof data == 'string' ?
            data == "loading" ?
                <div style={styles.centerContainer}>
                    <div className="spinner"></div>
                </div>
                :
                data == "empty" ?
                    <div style={styles.centerContainer}>
                        <span style={styles.textPrimary}>Məlumat tapılmadı!</span>
                    </div>
                    :
                    data == 'error' ?
                        <div style={styles.centerContainer}>
                            <span style={styles.textError}>Problem var!</span>
                        </div>
                        :
                        ''
            :
            <>{props.children}</>
    );
};

export default RenderContent;
