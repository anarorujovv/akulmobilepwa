import React, { useEffect, useState } from 'react';
import useTheme from '../theme/useTheme';

const Button = ({ width, onClick, icon, isLoading, disabled, bg, ...props }) => {

  const theme = useTheme();
  const [animatedGap, setAnimatedGap] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setAnimatedGap(10);
    } else {
      setAnimatedGap(0);
    }
  }, [isLoading]);

  const styles = {
    button: {
      width: '100%',
      height: 50,
      backgroundColor: bg ? bg : theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      color: theme.stable.white,
      gap: animatedGap,
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.7 : 1,
      transition: 'all 0.3s ease',
      borderRadius: 4
    },
    text: {
      fontSize: 16,
      color: theme.stable.white
    },
    buttonIcon: {
      color: theme.stable.white,
      display: 'flex',
      alignItems: 'center'
    },
    spinner: {
      width: 20,
      height: 20,
      border: `2px solid transparent`,
      borderTop: `2px solid ${theme.stable.white}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <button
      disabled={isLoading || disabled}
      onClick={onClick}
      style={{
        width,
        height: 50,
        padding: 0,
        border: 'none',
        background: 'none'
      }}
    >
      <div style={styles.button}>
        {isLoading && (
          <div style={styles.spinner} />
        )}
        {icon && !isLoading && (
          <span style={{ ...styles.buttonIcon, marginRight: props.children ? 10 : 0 }}>{icon}</span>
        )}
        {props.children && (
          <span style={styles.text}>{props.children}</span>
        )}
      </div>
    </button>
  );
};

export default Button;
