import { screen } from '@testing-library/react';

import { App } from 'App';
import { renderWithRouter } from 'testingUtils';

describe('Login', () => {
  test('Renders login screen base state', () => {
    renderWithRouter(<App />, { route: '/login' });
    const title = screen.getByText(/Log In/i);
    const subHeaderText = screen.getByText(/Currently open to registered beta users/i);
    const signInWithGoogle = screen.getByText(/Continue with Google/i);
    const termsAndConditions = screen.getByText(/By continuing, you acknowledge that you have read, understood, and agree to our terms and condition/i);

    expect(title).toBeInTheDocument();
    expect(subHeaderText).toBeInTheDocument();
    expect(signInWithGoogle).toBeInTheDocument();
    expect(termsAndConditions).toBeInTheDocument();
  });
});
