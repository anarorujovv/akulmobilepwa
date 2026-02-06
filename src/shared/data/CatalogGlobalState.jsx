import { createContext, useState } from "react";

export const CatalogGlobalContext = createContext();

export const CatalogGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units,setUnits] = useState(null)

    return (
        <CatalogGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </CatalogGlobalContext.Provider>
    );
}