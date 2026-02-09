import React from 'react';
import useTheme from '../theme/useTheme';

const MySelection = ({ label, list, valueName, labelName, onValueChange, value, width }) => {

    let theme = useTheme();

    const styles = {
        container: {
            width: width || '100%',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 10
        },
        label: {
            fontSize: 14,
            color: theme.input.grey,
            marginBottom: 5
        },
        selectContainer: {
            height: 40,
            borderBottom: `1px solid ${theme.input.grey}`,
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
        },
        select: {
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: 16,
            color: theme.black,
            outline: 'none',
            cursor: 'pointer',
            paddingRight: 20
        }
    };

    return (
        <div style={styles.container}>
            <span style={styles.label}>{label}</span>
            <div style={styles.selectContainer}>
                <select
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    style={styles.select}
                >
                    {list && list.length > 0 && list.map(item => (
                        <option
                            key={item[valueName]}
                            value={item[valueName]}
                            style={{ color: theme.black }}
                        >
                            {/* item[labelName] bazen obje olabiliyor mu? Hayır genelde string. Garanti olsun diye kontrol edilebilir ama şimdilik varsayılan kalsın */}
                            {item[labelName]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MySelection;