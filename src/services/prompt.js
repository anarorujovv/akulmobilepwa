import { Alert } from "react-native";

const prompt = (message, onPress) => {
    Alert.alert(
        'Diqqət',
        message,
        [
            {
                text: 'İmtina et',
                style: 'cancel',
            },
            {
                text: 'Təsdiqlə',
                onPress: onPress,
            },
        ],
        { cancelable: true }
    );
}

export default prompt