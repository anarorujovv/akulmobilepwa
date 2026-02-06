import { createContext, useState } from "react";

export const PaymentGlobalContext = createContext();

export const PaymentGlobalProvider = (props) => {

    const [document, setDocument] = useState(null);
    const [cashes,setCashes] = useState(null);
    const [types,setTypes] = useState({
        type:"",
        direct:""
    });

    return (
        <PaymentGlobalContext.Provider value={
            {
                document,
                setDocument,
                cashes,
                setCashes,
                types,
                setTypes
            }
        }>
            {props.children}
        </PaymentGlobalContext.Provider>
    );

}