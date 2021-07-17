import { createContext } from 'react';
import { User } from 'app/types';

export interface AuthContextType {
  user: User;
  loading: boolean;
  error?: any;
  signIn: Function;
  signOut: Function;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;
