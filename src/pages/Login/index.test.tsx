import { screen } from '@testing-library/react';

import { App } from 'App';
import { renderWithRouter } from 'testingUtils';

describe('Login', () => {
  test('Renders login screen base state', () => {
    renderWithRouter(<App />, { route: '/#/login' });

    const title = screen.getByText(/Log In/i);
    const subHeaderText = screen.getByText(/Currently open to registered beta users/i);
    const signInWithGoogle = screen.getByText(/Continue with Google/i);
    const termsAndConditions = screen.getByText(/By continuing, you acknowledge that you have read, understood, and agree to our terms and condition/i);

    expect(title).toBeInTheDocument();
    expect(subHeaderText).toBeInTheDocument();
    expect(signInWithGoogle).toBeInTheDocument();
    expect(termsAndConditions).toBeInTheDocument();
  });
  
  test('Random route redirects to login', () => {
    renderWithRouter(<App />, { route: '/random' });
    
    const title = screen.getByText(/Log In/i);
    expect(title).toBeInTheDocument();
  });

  test('Non-authenticated user gets redirected to login', () => {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.setItem('accessToken', '');

    renderWithRouter(<App />, { route: '/#/randomRoute' });
    
    const title = screen.getByText(/Log In/i);
    expect(title).toBeInTheDocument();
  });

  test('Authenticated user does not see login page', () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('accessToken', 'invalid-access-token');

    // TODO: This is not working
    renderWithRouter(<App />, { route: '/#/dashboard' });
    
  });
});
