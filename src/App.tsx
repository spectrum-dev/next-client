import {
  HashRouter,
  Redirect,
  Switch,
  Route,
  RouteProps,
} from 'react-router-dom';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import {
  ApolloProvider,
} from '@apollo/client';

import useAuth, { AuthProvider } from 'containers/Authentication/Login/useAuth';

import { client } from 'app/apolloClient';

// Screens
import Login from 'containers/Authentication/Login';
import Dashboard from 'containers/Dashboard';
import Board from 'containers/Board';

function AuthenticatedRoute(props: RouteProps) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <Route {...props} />;
}

export const App = () => (
  <ChakraProvider theme={theme}>
      <AuthProvider>
        <ApolloProvider client={client}>
          <HashRouter>
            <Switch>
              <Route path="/login" component={Login} />
              <AuthenticatedRoute path="/dashboard" component={Dashboard} />
              <AuthenticatedRoute path="/board/:strategyId" component={Board} />
              <Redirect from="/" to="/login" />
            </Switch>
          </HashRouter>
        </ApolloProvider>
      </AuthProvider>
  </ChakraProvider>
);
