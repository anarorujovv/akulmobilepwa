import AsyncStorageWrapper from "../AsyncStorageWrapper";
import api from "../api";

const fetchPaydirByDocument = async (id) => {
    await api('demands/bash.php', {
        action: 'payed',
        value: 1,
        list: [
            id
        ],
        token: await AsyncStorageWrapper.getItem('token')
    })
}

export default fetchPaydirByDocument;