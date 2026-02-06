import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

const fetchPaydirByDocument = async (id) => {
    await api('demands/bash.php', {
        action: 'payed',
        value: 1,
        list: [
            id
        ],
        token: await AsyncStorage.getItem('token')
    })
}

export default fetchPaydirByDocument;