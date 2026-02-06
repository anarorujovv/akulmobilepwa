const findUnitById = (product, units) => {
    let myUnits = [...units[product.ProductId]];
    let findIndexById = myUnits.findIndex(rel => rel.Id == product.UnitId);
    return {...myUnits[findIndexById]};
}


export default findUnitById;
