export const GET_CURRENCIES = {
    operationName: "currencyResolver",
    query: `
    query currencyResolver {
        currencies {
            symbol
            label
        }
    }
`
}

export const GET_CATEGORIES = {
    operationName: "categoryResolver",
    query: `
    query categoryResolver {
        categories {
            name
        }
    }
`
}

export const GET_CATEGORY_PRODUCTS = ({ category }) => (
    {
        operationName: "categoryResolver",
        query: `
            query categoryResolver {
                category (input: {title: "${category}"}) {
                    name
    	            products {
                        id
                        brand
                        name
                        inStock
                        gallery
                        prices {
                            currency {
                                symbol
                            }
                            amount
                        }
                        attributes {
                            id
                            name
                            type
                            items {
                                id
                                value
                                displayValue
                            }
                        }
                    }
                }
            }
        `
    }
)

export const GET_PRODUCT_BY_ID = ({ ProductID }) => (
    {
        operationName: "productResolver",
        query: `
            query productResolver {
                product (id: "${ProductID}") {
                    id
                    name
                    inStock
                    gallery
                    description
                    brand
                    attributes {
                        id
                        name
                        type
                        items {
                            displayValue
                            value
                            id
                        }
                    }
                    prices {
                        currency {
                            symbol
                        }
                        amount
                    }
                }
            }
        `
    }
)