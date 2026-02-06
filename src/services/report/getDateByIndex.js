import moment from "moment";

const getDateByIndex = (index) => {

    const today = new Date();

    let filterInfo = {

    };

    let data = [
        {
            value: 'day'
        },
        {
            value: 'yesterday'
        },
        {
            value: 'month'
        }, {
            value: 'lastMonth'
        },
        {
            value: 'all'
        },
    ]

    filterInfo.agrigate = 1;

    switch (data[index].value) {
        case 'day':
            filterInfo.momb = moment(today).format('YYYY-MM-DD 00:00:00');
            filterInfo.mome = moment(today).format('YYYY-MM-DD 23:59:59');
            break;
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            filterInfo.momb = moment(yesterday).format('YYYY-MM-DD 00:00:00')
            filterInfo.mome = moment(yesterday).format('YYYY-MM-DD 23:59:59')
            break;
        case 'month':
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            filterInfo.momb = moment(firstDayOfMonth).format('YYYY-MM-DD 00:00:00');
            filterInfo.mome = moment(today).format("YYYY-MM-DD 23:59:59");
            break;

        case 'lastMonth':
            const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

            filterInfo.momb = moment(firstDayLastMonth).format("YYYY-MM-DD 00:00:00");
            filterInfo.mome = moment(lastDayLastMonth).format("YYYY-MM-DD 23:59:59");
            
            break;
        case 'all':
            delete filterInfo.momb;
            delete filterInfo.mome;
            break;
    }

    return { ...filterInfo };
}

export default getDateByIndex;
