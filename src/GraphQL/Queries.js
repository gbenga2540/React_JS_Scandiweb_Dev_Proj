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


// These parameters are fetched one more time incase a Person loads the description page directly from the Searchbar without clicking a Product Card, otherwise passing a few of the parameters in { GET_CATEGORY_PRODUCTS } would have been the best option to reduce the number of data being fetched.
export const GET_PRODUCT_BY_ID = ({ ProductID }) => (
    {
        operationName: "productResolver",
        query: `
            query productResolver {
                product (id: "${ProductID}") {
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
                            displayValue
                            value
                            id
                        }
                    }
                    description
                }
            }
        `
    }
)