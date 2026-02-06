import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import { formatPrice } from './../formatPrice';
const payByRange = async (info, payAmount, documentAmount) => {
    let paymentList = [];
    let demandList = [];
    let targetAmount = 0;

    let obj = {
        doctype: info.target,
        id: info.Id,
        token: await AsyncStorage.getItem("token")
    }
    await api('links/get.php', obj).then(element => {
        if (element != null) {
            if (element.List[0]) {
                paymentList = element.List;
            }
        }
    })

    paymentList.forEach((item, index) => {
        targetAmount += formatPrice(item.Amount);
    })

    let totalAmount = targetAmount + formatPrice(payAmount);
    let dAmount = formatPrice(documentAmount);

    if (totalAmount == 0) {
        return 1;
    } else if (totalAmount < formatPrice(dAmount) && totalAmount != 0) {
        return 2;
    } else if (totalAmount == formatPrice(dAmount)) {
        return 3;
    } else if (totalAmount > formatPrice(dAmount)) {
        return 4;
    }
}

export default payByRange;