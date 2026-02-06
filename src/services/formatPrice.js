// export function formatPrice(num) {
//     var isNum = !isNaN(parseFloat(num));
//     return isNum
//         ? parseFloat(parseFloat(parseFloat(num).toFixed(2)))
//         : "";
// }

export function formatPrice(num) {
    var isNum = !isNaN(parseFloat(num));
    return isNum
        ? parseFloat(parseFloat(num).toFixed(4))
        : "";
}