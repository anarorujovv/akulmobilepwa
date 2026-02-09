import axios from "axios";
import ErrorMessage from "../shared/ui/RepllyMessage/ErrorMessage";
import AsyncStorage from "./AsyncStorageWrapper";

const api = async (link, data) => {
    let publicMode = await AsyncStorage.getItem('publicMode');
    let customApiUrl = await AsyncStorage.getItem('apiCustomUrl');
    let answer = null;

    // Web'de navigator.onLine ile internet bağlantısını kontrol ediyoruz
    if (!navigator.onLine) {
        ErrorMessage("İnternet bağlantınızı kontrol edin");
        return null;
    }

    try {
        let apiUrl = customApiUrl || `https://api.akul.az/1.0/${publicMode}/controllers/`;

        await axios.post(
            `${apiUrl}${link}`,
            data,
            {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${await AsyncStorage.getItem('token')}`
                }
            }
        ).then(async (response) => {
            if (response.data.Headers.ResponseStatus == "0") {
                answer = response.data.Body;
            } else if (response.data.Headers.ResponseStatus == "104") {
                ErrorMessage("Sessiya vaxtı keçdi");
                await AsyncStorage.removeItem('token');
                // React Native'deki RNRestart yerine window.location.reload() kullanıyoruz
                window.location.reload();
            } else {
                throw response.data.Body;
            }
        });

    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.code === 'ECONNABORTED') {
                ErrorMessage("Bağlantı vaxtı keçdi");
            } else if (!err.response) {
                ErrorMessage("Serverə qoşulmaq mümkün deyil");
            } else {
                ErrorMessage(err.message);
            }
        } else {
            ErrorMessage(err);
        }
    }

    return answer;
};

export default api;