import { createContext, useState } from "react";

export const CustomerOrderGlobalContext = createContext();

export const CustomerOrderGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units,setUnits] = useState(null)
    
    return (
        <CustomerOrderGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </CustomerOrderGlobalContext.Provider>
    );
}