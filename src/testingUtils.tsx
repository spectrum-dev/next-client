import { ReactElement } from 'react';

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

type RenderWithRouterProps = { route?: string };

export const renderWithRouter = (ui: ReactElement, { route = '/' }: RenderWithRouterProps = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(ui, { wrapper: BrowserRouter });
};