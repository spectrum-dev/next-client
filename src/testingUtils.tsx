import { ReactElement } from 'react';

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

type RenderWithRouterProps = { route?: string };

export const renderWithRouter = (ui: ReactElement, { route = '/' }: RenderWithRouterProps = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(ui, { wrapper: BrowserRouter });
};

export const IS_AUTHENTICATED = 'true';
export const ACCESS_TOKEN = 'valid-access-token';
export const EMAIL = 'user@imbue.dev';
export const FIRST_NAME = 'Test';
export const LAST_NAME = 'User';

export const setupAuthenticatedUser = () => {
  localStorage.setItem('isAuthenticated', IS_AUTHENTICATED);
  localStorage.setItem('accessToken', ACCESS_TOKEN);
  localStorage.setItem('email', EMAIL);
  localStorage.setItem('firstName', FIRST_NAME);
  localStorage.setItem('lastName', LAST_NAME);
};

export const renderWithAuthenticatedRouter = (ui: ReactElement, { route = '/' }: RenderWithRouterProps = {}) => {
  setupAuthenticatedUser();
  renderWithRouter(ui, { route });
};
