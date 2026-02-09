import React from 'react';
import useTheme from '../theme/useTheme';
import { IoArrowBack } from 'react-icons/io5';
import IconButton from './IconButton';

const SearchHeader = ({ onPress, value, onChange, placeholder }) => {
  const theme = useTheme();

  const styles = {
    container: {
      backgroundColor: theme.bg,
      height: 55,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      borderBottom: `1px solid ${theme.input.greyWhite}`,
      padding: '0 10px'
    },
    left: {
      width: '15%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    right: {
      width: '75%',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    input: {
      fontSize: 16,
      width: '100%',
      color: theme.black,
      height: 53,
      border: 'none',
      backgroundColor: 'transparent',
      outline: 'none',
      caretColor: theme.primary
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <IconButton onPress={onPress} size={40}>
          <IoArrowBack size={25} color={theme.grey} />
        </IconButton>
      </div>
      <div style={styles.right}>
        <input
          style={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default SearchHeader;