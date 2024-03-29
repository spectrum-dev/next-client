import {
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { httpLink } from '../../app/apolloClient';

import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

import { useToast } from '@chakra-ui/react';
import {
  useGoogleLogin, useGoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline,
} from 'react-google-login';

import fetcher from 'app/fetcher';
import history from 'app/history';
import { User } from 'app/types';
import AuthContext, { AuthContextType } from 'app/contexts/auth';

import { ACCOUNT_WHITELIST_STATUS } from 'app/gql';

const CLIENT_ID = '127712187286-65rpilkupfcu9h7b87u944kcs5f6e3j6.apps.googleusercontent.com';

const ERROR_LOGGING_IN_REACT_GOOGLE_LOGIN = 'There was an error logging in. Please try again';
const ERROR_LOGGING_OUT_REACT_GOOGLE_LOGIN = 'There was an error logging out. Please try again';
const ERROR_SCRIPT_LOADING_REACT_GOOGLE_LOGIN = 'There was error setting up Google single sign on. Please unblock your browser cookies.';

const ERROR_SETTING_AUTHENTICATED_STATUS = 'There was an error setting the authenticated status of the user';
const WHITELIST_RESPONSE_ERROR = 'This accounts has not been added to the whitelist. Please contact us if you feel this is an error.';
const DJANGO_AUTHENTICATION_ERROR = 'There was an error sending the authentication token to the backend';

// Types
interface AuthenticationRequestBody {
  access_token: string;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User>();
  const [error] = useState<any | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  const toast = useToast();

  const getAuthenticationStatus = () => ({
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated') || 'false') === true,
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    email: localStorage.getItem('email') || '',
    accessToken: localStorage.getItem('accessToken') || '',
  });

  const setAuthenticationStatus = (response: User) => {
    localStorage.setItem('isAuthenticated', response.isAuthenticated ? 'true' : 'false');
    localStorage.setItem('firstName', response.firstName);
    localStorage.setItem('lastName', response.lastName);
    localStorage.setItem('email', response.email);
    localStorage.setItem('accessToken', response.accessToken);
  };

  useEffect(() => {
    try {
      const currentAuthenticationStatus = getAuthenticationStatus();
      if (currentAuthenticationStatus.isAuthenticated) {
        setUser(currentAuthenticationStatus);
      }
    } catch (e) {
      toast({
        title: ERROR_SETTING_AUTHENTICATED_STATUS,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingInitial(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoginSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ): Promise<void> => {
    try {
      setLoading(true);

      if (!('profileObj' in response)) {
        return;
      }
      
      const authLink = setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: response.accessToken ? `Bearer ${response.accessToken}` : '',
        },
      }));

      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
      });

      const { data: { accountWhitelistStatus: { status } }, errors } = await client.query({ query: ACCOUNT_WHITELIST_STATUS, variables: { email: response.profileObj.email } });

      if (!errors && status) {
        const authenticationRequestBody: AuthenticationRequestBody = {
          access_token: response.accessToken,
        };
        const authResponse = await fetcher.post('/rest-auth/google/', authenticationRequestBody, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (authResponse.status === 200) {
          const responsePayload: User = {
            isAuthenticated: true,
            firstName: response.profileObj.givenName,
            lastName: response.profileObj.familyName,
            email: response.profileObj.email,
            accessToken: response.accessToken,
          };
          setAuthenticationStatus(responsePayload);
          setUser(responsePayload);
          history.push('/dashboard');
        } else {
          throw Error(DJANGO_AUTHENTICATION_ERROR);
        }
      } else {
        throw Error(WHITELIST_RESPONSE_ERROR);
      }
    } catch (e) {
      toast({
        title: WHITELIST_RESPONSE_ERROR,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      setUser({
        isAuthenticated: false,
        firstName: '',
        lastName: '',
        email: '',
        accessToken: '',
        error: e,
      });
    } finally {
      setLoading(false);
    }
  };

  const onLoginError = () => {
    toast({
      title: ERROR_LOGGING_IN_REACT_GOOGLE_LOGIN,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const onLogoutSuccess = () => {
    localStorage.clear();
    history.push('/login');
  };

  const onLogoutError = () => {
    toast({
      title: ERROR_LOGGING_OUT_REACT_GOOGLE_LOGIN,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const { signIn } = useGoogleLogin({
    onSuccess: onLoginSuccess,
    onFailure: onLoginError,
    onScriptLoadFailure: () => {
      toast({
        title: ERROR_SCRIPT_LOADING_REACT_GOOGLE_LOGIN,
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    },
    clientId: CLIENT_ID,
    accessType: 'online',
    cookiePolicy: 'single_host_origin',
  });

  const { signOut } = useGoogleLogout({
    onLogoutSuccess,
    onFailure: onLogoutError,
    clientId: CLIENT_ID,
    accessType: 'online',
  });

  return (
    <AuthContext.Provider value={
      {
        user, signIn, signOut, error, loading,
      } as AuthContextType
    }
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

export default function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
