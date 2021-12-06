import {
  HashRouter,
  Redirect,
  Switch,
  Route,
  RouteProps,
  useLocation,
} from 'react-router-dom';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import {
  ApolloProvider,
} from '@apollo/client';

import useAuth, { AuthProvider } from 'pages/Login/useLogin';

import { client } from 'app/apolloClient';

// Screens
import Login from 'pages/Login';
import Dashboard from 'pages/Dashboard';
import NewDashboard from 'pages/NewDashboard';
import Board from 'containers/Board';

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-display" style={{ display: 'none' }}>{`/#${location.pathname}`}</div>;
};

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
              <AuthenticatedRoute path="/newDashboard" children={<NewDashboard pane="DASHBOARD" />} />
              <AuthenticatedRoute path="/strategies" children={<NewDashboard pane="STRATEGIES" />} />
              <AuthenticatedRoute path="/settings" children={<NewDashboard pane="SETTINGS" />} />
              <AuthenticatedRoute path="/board/:strategyId" component={Board} />
              <Redirect from="/" to="/login" />
            </Switch>

            <LocationDisplay />
          </HashRouter>
        </ApolloProvider>
      </AuthProvider>
  </ChakraProvider>
);
