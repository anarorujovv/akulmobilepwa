import { createContext, useState } from "react";

export const CustomerGlobalContext = createContext();

export const CustomerGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    
    return (
        <CustomerGlobalContext.Provider value={
            {
                document,
                setDocument
            }
        }>
            {props.children}
        </CustomerGlobalContext.Provider>
    );

}