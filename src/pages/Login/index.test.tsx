import { screen } from '@testing-library/react';

import { App } from 'App';
import { renderWithRouter, setupAuthenticatedUser } from 'testingUtils';

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Renders login screen', () => {
    const route = '/#/login';
    renderWithRouter(<App />, { route });

    const title = screen.getByText(/Log In/i);

    expect(title).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent(route);
  });
  
  test('Invalid route redirects to login for non-authenticated user', () => {
    const route = '/#/invalidRoute';
    renderWithRouter(<App />, { route });
    
    expect(screen.getByTestId('location-display')).toHaveTextContent('/#/login');
  });

  test('Invalid route redirects to login for authenticated user', () => {
    setupAuthenticatedUser();

    const route = '/#/invalidRoute';
    renderWithRouter(<App />, { route });
    
    expect(screen.getByTestId('location-display')).toHaveTextContent('/#/login');
  });

  test('Non-authenticated user accessing valid route gets redirected to login', () => {
    const route = '/#/dashboard';
    renderWithRouter(<App />, { route });
    
    expect(screen.getByTestId('location-display')).toHaveTextContent('/#/login');
  });

  test('Authenticated user accessing valid route does not get redirected to login', () => {
    setupAuthenticatedUser();

    const route = '/#/dashboard';
    renderWithRouter(<App />, { route });

    expect(screen.getByTestId('location-display')).toHaveTextContent(route);
  });
});
