import { createContext, useState } from "react";

export const DemandGlobalContext = createContext();

export const DemandGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units,setUnits] = useState(null)

    return (
        <DemandGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </DemandGlobalContext.Provider>
    );
}