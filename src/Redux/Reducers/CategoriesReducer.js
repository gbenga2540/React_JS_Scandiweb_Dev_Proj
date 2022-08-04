export const curr_category = (state = 0, action) => {
    switch (action.type) {
        case "CURRENT_CATEGORY":
            return action.payload;
        default:
            return state;
    }
}

export const all_categories = (state = [], action) => {
    switch (action.type) {
        case "ALL_CATEGORIES":
            return action.payload;
        default:
            return state;
    }
}