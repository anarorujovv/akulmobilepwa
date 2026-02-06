import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { formatPrice } from "./formatPrice";
import ErrorMessage from "../shared/ui/RepllyMessage/ErrorMessage";

const mergeProductQuantities = async (document,id) => {

    let info = { ...document };

    for (let index = 0; index < info.Positions.length; index++) {
        info.Positions[index].StockQuantity = '0'
    }

    let obj = {
        moment: info.Moment,
        stockid: id,
        token: await AsyncStorage.getItem('token')
    }

    info.StockId = id;

    if (info.Positions[0]) {
        let products = [...info.Positions];
        let ids = []
        products.forEach((item, index) => {
            ids.push(item.ProductId);
        })

        obj.productids = [...ids];
    }

    await api('stockbalancebyid/get.php', obj)
        .then(item => {
            if (item != null && item.List[0]) {
                let list = [...item.List];
                for (let index = 0; index < list.length; index++) {
                    let positions = [...info.Positions];
                    let answer = positions.findIndex(rel => rel.ProductId == list[index].ProductId);
                    if (answer != -1) {
                        info.Positions[answer].StockQuantity = formatPrice(list[index].Quantity);
                    }
                }
            }
        })
        .catch(err => {
            ErrorMessage(err);
        })

    return { ...info };
}

export default mergeProductQuantities;