import { createContext, useState } from "react";

export const InventoryGlobalContext = createContext();

export const InventoryGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units, setUnits] = useState([]);

    return (
        <InventoryGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </InventoryGlobalContext.Provider>
    );

}