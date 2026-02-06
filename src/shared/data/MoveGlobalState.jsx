import { createContext, useState } from "react";

export const MoveGlobalContext = createContext();

export const MoveGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [units, setUnits] = useState(null)

    return (
        <MoveGlobalContext.Provider value={
            {
                document,
                setDocument,
                units,
                setUnits
            }
        }>
            {props.children}
        </MoveGlobalContext.Provider>
    );
}