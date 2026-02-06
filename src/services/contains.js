const contains = (arr, value) => {
    let index = arr.findIndex(rel => rel.Id == value);
    return index == -1 ? null : arr[index];
}

export default contains;