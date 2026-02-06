function translateProductStockTerm(term) {
    switch (term) {
        case "demands":
            return "Satış";

        case "losses":
            return "Silinmə";
        case "enters":
            return "Daxilolma";

        case "sales":
            return "Pərakəndə satış";

        case "demandreturns":
            return "Satış qautarması";

        case "moves":
            return "Yerdəyişmə";

        case "supplies":
            return "Alış";

        case "supplyreturns":
            return "Alış qaytarması";

        case "returns":
            return "Pərakəndə qaytarması";

        default:
            return "Bilinmir";

    }
}

export default translateProductStockTerm;