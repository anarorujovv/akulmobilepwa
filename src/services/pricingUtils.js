import { formatPrice } from "./formatPrice";

const pricingUtils = (positions) => {

    let data = [...positions];
    
    let price = 0;
    let basicPrice = 0;

    let isDiscount = false;

    for (let index = 0; index < data.length; index++) {
        price += formatPrice(data[index].Price) * formatPrice(data[index].Quantity);
        if (data[index].BasicPrice) {
            basicPrice += formatPrice(data[index].BasicPrice) * formatPrice(data[index].Quantity);
            isDiscount = true;
        }
    }

    let obj = {
        Discount: 0,
        Amount: price,
    }

    if (isDiscount) {
        obj.BasicAmount = basicPrice;
        let totalDiscount = 100 - ((price * 100) / basicPrice);
        obj.Discount = totalDiscount;
    }

    return obj;
}

export default pricingUtils;