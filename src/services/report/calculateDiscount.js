import { formatPrice } from "../formatPrice";

/**
 * The calculateDiscount function calculates the discount percentage based on the basic price and the current price.
 * 
 * @param {number} basicPrice - The original price before any discounts.
 * @param {number} price - The current price after applying discounts.
 * @returns {number} - The calculated discount percentage.
 */
const calculateDiscount = (basicPrice, price) => {
    return formatPrice(100 - ((formatPrice(price) * 100) / formatPrice(basicPrice)));
}

export default calculateDiscount;