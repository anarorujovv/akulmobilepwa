import { createContext, useState } from "react";

export const SupplyReturnGlobalContext = createContext();

export const SupplyReturnGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units, setUnits] = useState([]);

    return (
        <SupplyReturnGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </SupplyReturnGlobalContext.Provider>
    );

}