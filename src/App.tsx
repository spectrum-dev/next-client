import {
  // Router,
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

// import history from 'app/history';
import useAuth, { AuthProvider } from 'containers/Authentication/Login/useAuth';

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
      <HashRouter basename="spectrum">
        <Switch>
          <Route path="/login" component={Login} />
          <AuthenticatedRoute path="/dashboard" component={Dashboard} />
          <AuthenticatedRoute path="/board" component={Board} />
          <Redirect from="/" to="/login" />
        </Switch>
      </HashRouter>
    </AuthProvider>
  </ChakraProvider>
);
