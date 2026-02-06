const translatePayed = (payed) => {
    switch (payed) {
        case 1:
            return {
                statusText: "Ödənilməyib",
                status: false
            }
        case 2:
            return {
                statusText: "Qismən ödənilib",
                status: false
            }
        case 3:
            return {
                statusText: "Ödənilib",
                status: true
            }
        case 4:
            return {
                statusText: 'Artıq ödənilib',
                status: true
            }
        default:
            return {}
    }
}

export default translatePayed