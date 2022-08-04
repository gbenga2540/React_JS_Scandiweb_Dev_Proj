// !-- NOT IN USE --! ... Functionality has been replaced with js fetch

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { back_end_endpoint } from './BackEndEndpoint';

const errorLink = onError(({ graphqlErrors, networkError }) => {
    if (graphqlErrors) {
        graphqlErrors.map(({ message, location, path }) => (
            console.error(message)
        ))
    }
    if (networkError) {
        networkError.map(err => (
            console.error('GraphQL Network Error ' + err)
        ))
    }
})

const link = from([
    errorLink,
    new HttpLink({ uri: back_end_endpoint() })
])

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});

export default client;

