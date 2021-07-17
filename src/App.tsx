import {
  Router,
  Redirect,
  Switch,
  Route,
} from 'react-router-dom';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';

import history from 'app/history';

// Screens
import Login from 'containers/Authentication/Login';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router history={history}>
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  </ChakraProvider>
);
