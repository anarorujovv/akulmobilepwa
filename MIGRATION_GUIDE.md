# React Native to React.js PWA Migration Guide

Bu belge, React Native CLI projesinin React.js PWA'ya dönüştürülmesi sürecini açıklamaktadır.

## Tamamlanan Dönüşümler

### Temel Dosyalar
- ✅ `src/App.js` - Ana uygulama bileşeni
- ✅ `src/routers/stacks/MainStack.jsx` - Yönlendirme yapısı
- ✅ `src/security/Login.jsx` - Giriş sayfası
- ✅ `src/pages/Home.jsx` - Ana sayfa

### UI Bileşenleri
- ✅ `src/shared/ui/Button.jsx`
- ✅ `src/shared/ui/Input.jsx`
- ✅ `src/shared/ui/Line.jsx`
- ✅ `src/shared/ui/IconButton.jsx`
- ✅ `src/shared/ui/FabButton.jsx`
- ✅ `src/shared/ui/NoData.jsx`
- ✅ `src/shared/ui/RepllyMessage/ErrorMessage.jsx`
- ✅ `src/shared/ui/RepllyMessage/SuccessMessage.jsx`

### Servisler
- ✅ `src/services/AsyncStorageWrapper.js` - localStorage wrapper
- ✅ `src/services/api.js`
- ✅ `src/services/playSound.js`

### Stil Dosyaları
- ✅ `src/index.css` - Temel stiller ve animasyonlar

---

## Dönüştürülmesi Gereken Dosyalar

Aşağıdaki dosyalar hala React Native kütüphanelerini kullanıyor ve dönüştürülmesi gerekiyor:

### Yüksek Öncelikli (Çekirdek UI)
- [ ] `src/shared/ui/SearchHeader.jsx`
- [ ] `src/shared/ui/ListPagesHeader.jsx`
- [ ] `src/shared/ui/ManageHeader.jsx`
- [ ] `src/shared/ui/MyModal.jsx`
- [ ] `src/shared/ui/Selection.jsx`
- [ ] `src/shared/ui/SelectionDate.jsx`
- [ ] `src/shared/ui/MyPagination.jsx`
- [ ] `src/shared/ui/list/ListItem.jsx`
- [ ] `src/shared/ui/list/ProductListItem.jsx`
- [ ] `src/shared/ui/modals/*.jsx` (tüm modal dosyaları)

### Sayfa Bileşenleri
Tüm `src/pages/*` klasöründeki dosyalar dönüştürülmeli.

---

## Dönüşüm Kuralları

### 1. Import Değişiklikleri

#### React Native → React
```javascript
// Önce
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, StyleSheet, ActivityIndicator, TextInput, Pressable, Image } from 'react-native';

// Sonra
// Bu importları kaldırın ve HTML elementlerini kullanın
```

#### Navigation
```javascript
// Önce
import { useNavigation } from '@react-navigation/native';
navigation.navigate('Page', { param: value });
navigation.goBack();

// Sonra
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/page');
navigate(-1);
```

#### AsyncStorage
```javascript
// Önce
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sonra
import AsyncStorage from '../services/AsyncStorageWrapper';
// veya
import AsyncStorage from './AsyncStorageWrapper';
```

#### Icons
```javascript
// Önce
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Sonra
import { IoHome, IoAdd, IoClose } from 'react-icons/io5';
import { AiOutlineHome, AiOutlinePlus } from 'react-icons/ai';
import { FaBoxArchive, FaUsers } from 'react-icons/fa6';
import { MdPayments, MdHome } from 'react-icons/md';
```

#### Toast Mesajları
```javascript
// Önce
import { Toast } from 'react-native-toast-notifications';
Toast.show(message, { type: 'danger' });

// Sonra
import { toast } from 'react-toastify';
toast.error(message);
toast.success(message);
```

#### Restart
```javascript
// Önce
import RNRestart from 'react-native-restart';
RNRestart.restart();

// Sonra
window.location.reload();
```

#### Pressable / @react-native-material/core
```javascript
// Önce
import { Pressable } from '@react-native-material/core';
<Pressable onPress={handlePress}>...</Pressable>

// Sonra
<button onClick={handlePress} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>...</button>
// veya
<div onClick={handlePress} style={{ cursor: 'pointer' }}>...</div>
```

### 2. Bileşen Değişiklikleri

| React Native | React/HTML |
|--------------|------------|
| `<View>` | `<div>` |
| `<Text>` | `<span>` veya `<p>` |
| `<TouchableOpacity onPress={}>` | `<button onClick={}>` |
| `<Pressable onPress={}>` | `<button onClick={}>` veya `<div onClick={}>` |
| `<ScrollView>` | `<div style={{ overflowY: 'auto' }}>` |
| `<FlatList data={} renderItem={}>` | `{data.map((item) => <Component key={item.id} />)}` |
| `<Modal visible={}>` | Özel modal div (position: fixed) |
| `<TextInput>` | `<input>` |
| `<Image source={require('...')}>` | `<img src="">` |
| `<ActivityIndicator>` | CSS spinner (div ile) |
| `<SafeAreaView>` | Kaldır veya `<div>` ile değiştir |

### 3. Stil Değişiklikleri

```javascript
// Önce - StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 5
  }
});
<View style={styles.container}>

// Sonra - Inline styles object
const styles = {
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 20px', // paddingVertical + paddingHorizontal
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)' // elevation yerine
  }
};
<div style={styles.container}>
```

#### Özel Stil Notları
- `paddingHorizontal: X` → `paddingLeft: X, paddingRight: X` veya `padding: '0 Xpx'`
- `paddingVertical: X` → `paddingTop: X, paddingBottom: X` veya `padding: 'Xpx 0'`
- `marginHorizontal: X` → `marginLeft: X, marginRight: X`
- `marginVertical: X` → `marginTop: X, marginBottom: X`
- `elevation: X` → `boxShadow: '0 Xpx Xpx rgba(0,0,0,0.2)'`
- `borderBottomWidth: 1` → `borderBottom: '1px solid #color'`

### 4. Navigation Props Değişikliği

```javascript
// Önce - React Native Navigation props
const Component = ({ route, navigation }) => {
  const { param } = route.params;
  
  const handleBack = () => navigation.goBack();
  const handleNavigate = () => navigation.navigate('Page', { id: 123 });
};

// Sonra - React Router
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Component = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL parametreleri için
  const location = useLocation(); // state için
  const { param } = location.state || {};
  
  const handleBack = () => navigate(-1);
  const handleNavigate = () => navigate('/page/123');
  // veya state ile
  const handleNavigateWithState = () => navigate('/page', { state: { id: 123 } });
};
```

### 5. ActivityIndicator → CSS Spinner

```jsx
// Önce
<ActivityIndicator size={40} color={theme.primary} />

// Sonra
<div style={{
  width: 40,
  height: 40,
  border: `3px solid ${theme.input.grey}`,
  borderTop: `3px solid ${theme.primary}`,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
}} />

// CSS'e eklenecek (index.css'te mevcut):
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 6. Modal Dönüşümü

```jsx
// Önce
<Modal
  visible={isVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setIsVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {/* Modal içeriği */}
    </View>
  </View>
</Modal>

// Sonra
{isVisible && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }} onClick={() => setIsVisible(false)}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      maxWidth: 400,
      width: '90%'
    }} onClick={e => e.stopPropagation()}>
      {/* Modal içeriği */}
    </div>
  </div>
)}
```

---

## Icon Eşleştirme Tablosu

| react-native-vector-icons | react-icons |
|---------------------------|-------------|
| `Ionicons name="home"` | `import { IoHome } from 'react-icons/io5'` |
| `Ionicons name="add-outline"` | `import { IoAdd } from 'react-icons/io5'` |
| `Ionicons name="close"` | `import { IoClose } from 'react-icons/io5'` |
| `Ionicons name="menu"` | `import { IoMenu } from 'react-icons/io5'` |
| `Ionicons name="chevron-back"` | `import { IoChevronBack } from 'react-icons/io5'` |
| `Ionicons name="trash"` | `import { IoTrash } from 'react-icons/io5'` |
| `AntDesign name="dashboard"` | `import { AiOutlineDashboard } from 'react-icons/ai'` |
| `AntDesign name="user"` | `import { AiOutlineUser } from 'react-icons/ai'` |
| `FontAwesome6 name="box-archive"` | `import { FaBoxArchive } from 'react-icons/fa6'` |
| `MaterialIcons name="payments"` | `import { MdPayments } from 'react-icons/md'` |

Tüm icon isimleri için: https://react-icons.github.io/react-icons/

---

## Yüklenen NPM Paketleri

```bash
npm install react-router-dom react-icons react-toastify
```

## Sonraki Adımlar

1. Bu rehberi kullanarak kalan bileşenleri birer birer dönüştürün
2. Her dönüşümden sonra `npm start` ile test edin
3. Hata veren dosyaları öncelikli olarak düzeltin
4. Tarayıcı konsolunda hataları kontrol edin

## Notlar

- Scanner ve Print özellikleri web için farklı API'ler gerektirir (örn: Web Bluetooth API, window.print())
- NetInfo yerine `navigator.onLine` kullanılıyor
- Ses dosyaları `public/sounds/` klasörüne taşındı
