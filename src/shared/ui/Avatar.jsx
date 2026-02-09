import React from 'react';
import useTheme from '../theme/useTheme';

const Avatar = ({ size, txt, imageUrl }) => {
  let theme = useTheme();

  const styles = {
    container: {
      width: size,
      height: size,
      borderRadius: 3,
      backgroundColor: theme.primary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    text: {
      fontSize: 16,
      color: 'white',
      margin: 0
    }
  };

  return (
    <div style={styles.container}>
      {imageUrl ? (
        <img
          src={imageUrl}
          style={styles.image}
          alt="Avatar"
        />
      ) : (
        <span style={styles.text}>{txt ? txt[0] : ""}</span>
      )}
    </div>
  );
};

export default Avatar;