import { createContext, useState } from "react";

export const DemandReturnGlobalContext = createContext();

export const DemandReturnGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units,setUnits] = useState(null);

    return (
        <DemandReturnGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </DemandReturnGlobalContext.Provider>
    );

}