import { createContext, useState } from "react";

export const EnterGlobalContext = createContext();

export const EnterGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units, setUnits] = useState(null)

    return (
        <EnterGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </EnterGlobalContext.Provider>
    );
}