import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from '@apollo/client';

const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL || 'http://localhost:8080/graphql';

const httpLink = new HttpLink({ uri: GRAPHQL_API_URL });

const authMiddleware = new ApolloLink((operation, forward) => {
  // Adds authorization to header
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(httpLink, authMiddleware),
});

export { client };
