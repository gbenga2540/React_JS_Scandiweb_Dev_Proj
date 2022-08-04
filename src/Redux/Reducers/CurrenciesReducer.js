export const curr_currency = (state = 0, action) => {
    switch (action.type) {
        case "CURRENT_CURRENCY":
            return action.payload;
        default:
            return state;
    }
}

export const all_currencies = (state = [], action) => {
    switch (action.type) {
        case "ALL_CURRENCIES":
            return action.payload;
        default:
            return state;
    }
}