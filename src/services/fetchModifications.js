import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const fetchModifications = async (target) => {

    let list = [];

    let obj = {
        token: await AsyncStorage.getItem('token')
    }

    if (target) {
        obj.target = target
    }

    await api('modificationgroup/get.php', obj)
        .then(element => {
            if (element != null) {
                list = element;
            }
        })

    return list;
    
}

export default fetchModifications;