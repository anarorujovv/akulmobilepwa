import React from 'react';

const Avatar = ({ size, txt, imageUrl }) => {
  const styles = {
    container: {
      width: size,
      height: size,
      borderRadius: 6,
      backgroundColor: 'var(--adm-color-primary)',
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
      fontSize: size ? size * 0.4 : 16,
      color: '#fff',
      fontWeight: 600,
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
        <span style={styles.text}>{txt ? txt[0].toUpperCase() : ''}</span>
      )}
    </div>
  );
};

export default Avatar;