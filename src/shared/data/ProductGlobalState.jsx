import { createContext, useState } from "react";

export const ProductGlobalContext = createContext();

export const ProductGlobalProvider = (props) => {

    const [product,setProduct] = useState(null);

    return (
        <ProductGlobalContext.Provider value={
            {
                product,
                setProduct
            }
        }>
            {props.children}
        </ProductGlobalContext.Provider>
    );

}