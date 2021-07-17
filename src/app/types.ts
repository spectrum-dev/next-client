export interface User {
  isAuthenticated: boolean;
  firstName: String;
  lastName: String;
  email: String;
  accessToken: String;
  error?: any;
}
