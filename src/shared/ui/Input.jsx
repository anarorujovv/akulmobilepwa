import React, { useState } from 'react';
import useTheme from './../theme/useTheme';

const Input = ({ value, onChange, width, password, placeholder, rightIcon, type, disabled, txPosition, labelButton, onPressLabelButton, isRequired }) => {
  const [active, setActive] = useState(false);
  const theme = useTheme();

  const styles = {
    container: {
      width: width,
      height: 50,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    input: {
      borderWidth: 0,
      borderBottom: !active ? `1px solid ${theme.input.grey}` : `2px solid ${theme.primary}`,
      padding: 0,
      fontSize: 14,
      width: '100%',
      color: theme.input.text,
      textAlign: txPosition ? txPosition : 'left',
      outline: 'none',
      backgroundColor: 'transparent',
    },
    textNonButton: {
      color: theme.input.grey,
      fontSize: 14,
      textAlign: txPosition ? txPosition : 'left',
    },
    text: {
      color: theme.primary,
      fontSize: 14,
      textAlign: txPosition ? txPosition : 'left',
      textDecoration: 'underline',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    inputContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    labelContainer: {
      display: 'flex',
      flexDirection: 'row'
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (type === "number") {
      onChange(newValue.replace(',', '.'));
    } else {
      onChange(newValue);
    }
  };

  return (
    <div style={styles.container}>
      {labelButton ? (
        <button style={styles.text} onClick={onPressLabelButton}>
          <span style={{ color: isRequired ? 'red' : theme.input.grey }}>{isRequired ? '*' : ''}</span>
          <span>{placeholder}</span>
        </button>
      ) : (
        <div style={styles.labelContainer}>
          <span style={{ ...styles.textNonButton, color: isRequired ? 'red' : theme.input.grey }}>{isRequired ? '*' : ''}</span>
          <span style={styles.textNonButton}>{placeholder}</span>
        </div>
      )}

      <div style={styles.inputContainer}>
        <input
          disabled={disabled}
          type={password ? 'password' : type === 'number' ? 'number' : 'text'}
          value={String(value)}
          onChange={handleChange}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          placeholder='...'
          style={styles.input}
        />
        <div style={{ marginRight: 10 }} />
        {rightIcon}
      </div>
    </div>
  );
};

export default Input;
