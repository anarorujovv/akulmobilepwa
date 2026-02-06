import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultUnit = async () => {
    let unitIndex = await AsyncStorage.getItem('defaultUnit');
    if (unitIndex != null) {
        return Number(unitIndex)
    }else{
        return 0
    }
}

export default defaultUnit;