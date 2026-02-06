// src/services/report/applyDiscount.js

import { formatPrice } from "../formatPrice"; // Import the formatPrice function

/**
 * The applyDiscount function calculates the discounted price based on the given price and discount rate.
 * 
 * @param {number} price - The price before applying the discount.
 * @param {number} discount - The discount rate to be applied (in percentage).
 * @returns {number} - The discounted price.
 */
const applyDiscount = (price, discount) => {
    // Format the price using formatPrice and apply the discount rate
    return formatPrice(price) - (formatPrice(price) / 100) * discount; // Return the discounted price
}

export default applyDiscount; // Export the applyDiscount function