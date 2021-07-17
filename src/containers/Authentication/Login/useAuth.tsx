import {
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useToast } from '@chakra-ui/react';
import { useGoogleLogin, useGoogleLogout } from 'react-google-login';

import fetcher from 'app/fetcher';
import history from 'app/history';
import { User } from 'app/types';
import AuthContext, { AuthContextType } from 'app/contexts/auth';

const CLIENT_ID = '127712187286-65rpilkupfcu9h7b87u944kcs5f6e3j6.apps.googleusercontent.com';

const ERROR_SETTING_AUTHENTICATED_STATUS = 'There was an error setting the authenticated status of the user';
const WHITELIST_RESPONSE_ERROR = 'This accounts has not been added to the whitelist. Please contact us if you feel this is an error.';
const DJANGO_AUTHENTICATION_ERROR = 'There was an error sending the authentication token to the backend';

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

  const setAuthenticationStatus = (response: any) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('firstName', response?.profileObj?.givenName);
    localStorage.setItem('lastName', response?.profileObj?.familyName);
    localStorage.setItem('email', response?.profileObj?.email);
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

  const onLoginSuccess = async (res: any): Promise<any> => {
    try {
      setLoading(true);

      const whitelistRequestBody = {
        email: res?.profileObj?.email,
      };
      const whitelistResponse = await fetcher.post('authentication/validate', whitelistRequestBody);
      if (whitelistResponse.status === 200) {
        const authenticationRequestBody = {
          access_token: res.accessToken,
        };
        const response = await fetcher.post('/rest-auth/google/', authenticationRequestBody);
        if (response.status === 200) {
          const responsePayload = {
            isAuthenticated: true,
            firstName: res?.profileObj?.givenName,
            lastName: res?.profileObj.familyName,
            email: res?.profileObj?.email,
            accessToken: res.accessToken,
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
      const errorResponse = {
        isAuthenticated: false,
        firstName: '',
        lastName: '',
        email: '',
        accessToken: '',
        error: e,
      };
      toast({
        title: WHITELIST_RESPONSE_ERROR,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setUser(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const onLoginError = (res: any) => {
    console.log('There was an error');
    console.log(res);
  };

  const onLogoutSuccess = () => {
    localStorage.clear();
    history.push('/login');
  };

  const onLogoutError = () => {
    console.log('There was an error logging out');
  };

  const { signIn } = useGoogleLogin({
    onSuccess: onLoginSuccess,
    onFailure: onLoginError,
    onScriptLoadFailure: () => console.log('Script Loading Error'),
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
