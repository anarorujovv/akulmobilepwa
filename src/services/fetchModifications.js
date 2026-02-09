import AsyncStorageWrapper from "./AsyncStorageWrapper";
import api from "./api";

const fetchModifications = async (target) => {

    let list = [];

    let obj = {
        token: await AsyncStorageWrapper.getItem('token')
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