import { createContext, useState } from "react";

export const DebtGlobalContext = createContext();

export const DebtGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);

    return (
        <DebtGlobalContext.Provider value={
            {
                document,
                setDocument
            }
        }>
            {props.children}
        </DebtGlobalContext.Provider>
    );

}