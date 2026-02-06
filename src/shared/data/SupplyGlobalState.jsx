import { createContext, useState } from "react";

export const SupplyGlobalContext = createContext();

export const SupplyGlobalProvider = (props) => {

    const [document,setDocument] = useState(null);
    const [units,setUnits] = useState([]);

    return (
        <SupplyGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </SupplyGlobalContext.Provider>
    );

}