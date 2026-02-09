import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTheme from '../../shared/theme/useTheme';
import { IoArrowBack, IoBarcode, IoFlash, IoFlashOff, IoCameraReverse } from 'react-icons/io5';

const ProductScanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setData } = location.state || {}; // Access state correctly
  const theme = useTheme();

  const [code, setCode] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code && setData) {
      setData(code);
      navigate(-1);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.black || '#000',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      paddingTop: '40px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'absolute',
      top: 0,
      zIndex: 10
    },
    backButton: {
      background: 'rgba(0,0,0,0.3)',
      border: 'none',
      borderRadius: '12px',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
    },
    cameraArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },
    input: {
      padding: '15px',
      fontSize: '18px',
      borderRadius: '8px',
      border: `2px solid ${theme.primary}`,
      width: '80%',
      maxWidth: '400px',
      textAlign: 'center',
      outline: 'none',
      marginTop: '20px'
    },
    overlay: {
      border: `2px solid ${theme.primary}`,
      width: '70%',
      height: '40%', // Approximate scan area aspect ratio
      maxWidth: '300px',
      maxHeight: '300px',
      borderRadius: '20px',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: `0 0 0 100vmax rgba(0,0,0,0.6)` // Dim surroundings
    },
    instruction: {
      position: 'absolute',
      bottom: '50px',
      textAlign: 'center',
      width: '100%'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <IoArrowBack size={24} />
        </button>
        <span style={styles.title}>Məhsul Skaneri</span>
        <div style={{ width: '40px' }}></div> {/* Spacer for alignment */}
      </div>

      <div style={styles.cameraArea}>
        <div style={styles.overlay}>
          <IoBarcode size={100} color={theme.primary} style={{ opacity: 0.5 }} />
        </div>

        <form onSubmit={handleSubmit} style={{ zIndex: 20, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <input
            ref={inputRef}
            style={styles.input}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Barkodu daxil edin və ya oxudun"
            autoFocus
          />
        </form>
      </div>

      <div style={styles.instruction}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Barkod və ya QR kod</div>
        <div style={{ opacity: 0.7 }}>Ştrix-kodu manual daxil edin və ya skanerlə oxudun</div>
      </div>
    </div>
  )
}

export default ProductScanner;