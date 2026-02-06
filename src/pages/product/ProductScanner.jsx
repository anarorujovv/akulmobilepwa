import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import useTheme from '../../shared/theme/useTheme';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

const ProductScanner = ({ route, navigation }) => {
  let { setData } = route.params;
  let theme = useTheme();

  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  const scanLinePos = useSharedValue(0);

  useEffect(() => {
    scanLinePos.value = withRepeat(
      withTiming(SCAN_SIZE, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true
    );
  }, []);

  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLinePos.value }]
    };
  });

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.black,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.stable.white,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10
    },
    cameraStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    unfilled: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: '100%',
    },
    row: {
      flexDirection: 'row',
    },
    centerColumn: {
      width: SCAN_SIZE,
      height: SCAN_SIZE,
      backgroundColor: 'transparent',
      position: 'relative',
    },
    side: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    marker: {
      width: SCAN_SIZE,
      height: SCAN_SIZE,
      backgroundColor: 'transparent',
      zIndex: 2,
    },
    corner: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderColor: theme.primary,
    },
    topLeft: {
      top: 0,
      left: 0,
      borderTopWidth: 5,
      borderLeftWidth: 5,
      borderTopLeftRadius: 20,
    },
    topRight: {
      top: 0,
      right: 0,
      borderTopWidth: 5,
      borderRightWidth: 5,
      borderTopRightRadius: 20,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 5,
      borderLeftWidth: 5,
      borderBottomLeftRadius: 20,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 5,
      borderRightWidth: 5,
      borderBottomRightRadius: 20,
    },
    scanLine: {
      width: '100%',
      height: 2,
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
    footer: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      alignItems: 'center',
      padding: 20,
    },
    footerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.stable.white,
      marginBottom: 5,
    },
    footerSubText: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
    },
    backButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.3)',
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={30} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Məhsul Skaneri</Text>

        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={toggleCamera}
          >
            <Icon name="camera-flip-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={toggleFlash}
          >
            <Icon name={isFlashOn ? "flash" : "flash-off"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <RNCamera
        style={styles.cameraStyle}
        type={isFrontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
        flashMode={isFlashOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Kamera icazəsi',
          message: 'Məhsulları skan etmək üçün kameradan istifadəyə icazə verməlisiniz',
          buttonPositive: 'Tamam',
          buttonNegative: 'İmtina',
        }}
        onBarCodeRead={(e) => {
          setData(e.data)
          navigation.goBack();
        }}
      >
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.unfilled} />
          <View style={styles.row}>
            <View style={styles.side} />
            <View style={styles.centerColumn}>
              <View style={styles.marker}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
                <Animated.View style={[styles.scanLine, animatedLineStyle]} />
              </View>
            </View>
            <View style={styles.side} />
          </View>
          <View style={styles.unfilled} />
        </View>
      </RNCamera>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Barkod və ya QR kod</Text>
        <Text style={styles.footerSubText}>Kodu çərçivənin daxilinə gətirin</Text>
      </View>
    </View>
  )
}

export default ProductScanner;