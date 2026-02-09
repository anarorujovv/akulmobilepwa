import AsyncStorageWrapper from "../AsyncStorageWrapper";

const defaultUnit = async () => {
    let unitIndex = await AsyncStorageWrapper.getItem('defaultUnit');
    if (unitIndex != null) {
        return Number(unitIndex)
    } else {
        return 0
    }
}

export default defaultUnit;