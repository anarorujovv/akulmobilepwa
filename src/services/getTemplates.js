import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const getTemplates = async (type) => {
    let list = [];
    const result = await api('templates/get.php', {token: await AsyncStorage.getItem("token")});
    if (result.List[0]) {
        let lists = [...result.List]
        for (let index = 0; index < lists.length; index++)if (lists[index].Target == type) list.push(lists[index]);}
    return list;
}
export default getTemplates;