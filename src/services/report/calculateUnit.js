import { formatPrice } from "../formatPrice";

/**
 * The calculateUnit function calculates the quantity of products based on their units and positions.
 * 
 * @param {Object} units - An object containing unit information for each product.
 * @param {Array} positions - An array of product positions containing ProductId and UnitId.
 * @param {string} type - The type of operation, either "GET" or "POST".
 * @returns {Array} - An array of products with updated quantities.
 */


const calculateUnit = (units, positions, type) => {

    let products = [...positions];

    for (let index = 0; index < products.length; index++) {
        let zibilUnitIndex = units[products[index].ProductId];
        if (zibilUnitIndex) {
            let unitIndex = zibilUnitIndex.findIndex(rel => rel.Id == products[index].UnitId);
            let unit = units[products[index].ProductId][unitIndex];

            if (type == "GET") {
                products[index].Quantity = formatPrice(products[index].Quantity) / formatPrice(unit.Ratio);
                products[index].Price = formatPrice(products[index].Price) * formatPrice(unit.Ratio);
            }

            if (type == "POST") {
                products[index].Quantity = formatPrice(products[index].Quantity) * formatPrice(unit.Ratio);
                products[index].Price = formatPrice(products[index].Price) / formatPrice(unit.Ratio);

            }
        }

    }

    return products;

}

export default calculateUnit;