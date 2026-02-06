export default function isValidEAN(value) {
    if (!/^\d+$/.test(value)) return false;

    if (value.length === 13) {
        return isValidEAN13(value);
    } else if (value.length === 8) {
        return isValidEAN8(value);
    }

    return false;
};

const isValidEAN13 = function (ean) {
    if (ean.length !== 13) return false;

    const digits = ean.split('').map(Number);
    const checkDigit = digits.pop(); // son basamak kontrol hanesi

    const sum = digits.reduce(function (acc, digit, idx) {
        return acc + digit * (idx % 2 === 0 ? 1 : 3);
    }, 0);

    const calculatedCheckDigit = (10 - (sum % 10)) % 10;

    return checkDigit === calculatedCheckDigit;
};

const isValidEAN8 = function (ean) {
    if (ean.length !== 8) return false;

    const digits = ean.split('').map(Number);
    const checkDigit = digits.pop();

    const sum = digits.reduce(function (acc, digit, idx) {
        return acc + digit * (idx % 2 === 0 ? 3 : 1);
    }, 0);

    const calculatedCheckDigit = (10 - (sum % 10)) % 10;

    return checkDigit === calculatedCheckDigit;
};
