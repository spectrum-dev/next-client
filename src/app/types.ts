export interface User {
  isAuthenticated: boolean;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  error?: any;
}
