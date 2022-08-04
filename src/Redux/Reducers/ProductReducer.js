export const curr_product = (state = {}, action) => {
    switch (action.type) {
        case "SET_CURRENT_PRODUCT":
            return action.payload;
        case "CLEAR_CURRENT_PRODUCT":
            return {};
        default:
            return state;
    }
}

export const product_list = (state = [], action) => {
    switch (action.type) {
        case "SET_PRODUCT_LIST":
            return action.payload;
        case "CLEAR_PRODUCT_LIST":
            return [];
        default:
            return state;
    }
}