function translateDebtTerm(term) {
    switch (term) {
        case "Demand":
            return {
                title: "Satış",
                route: "demand"
            };
        case "PaymentIn":
            return {
                title: "Nağd Mədaxil",
                route: null
            };
        case "PaymentOut":
            return {
                title: "Nağd Məxaric",
                route: null
            };
        case "InvoiceIn":
            return {
                title: "Nağdıs Mədaxil",
                route: null
            };
        case "InvoiceOut":
            return {
                title: "Nağdsız Məxaric",
                route: null
            };
        case "SupplyReturn":
            return {
                title: "Alışın qaytarması",
                route: "supplyreturns"
            };
        case "Supply":
            return {
                title: "Alış",
                route: "supply"
            };
        case "DemandReturn":
            return {
                title: "Satışın qaytarması",
                route: "demandreturns"
            };
        case "Sale":
            return {
                title: "Pərakəndə satış",
                route: "sale"
            };
        case "Return":
            return {
                title: "Qaytarma",
                route: "returns"
            };
        case "CreditPayIn":
            return {
                title: "Kassadan Nağd Mədaxil",
                route: null
            };
        case "CreditPayOut":
            return {
                title: "Kassadan Nağd Məxaric",
                route: null
            };
        default:
            return {
                title: "Bilinmir",
                route: null
            };
    }

}

export default translateDebtTerm;