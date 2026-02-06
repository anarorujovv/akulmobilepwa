import { createContext, useState } from "react";

export const LossGlobalContext = createContext();

export const LossGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units, setUnits] = useState(null)

    return (
        <LossGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </LossGlobalContext.Provider>
    );
}