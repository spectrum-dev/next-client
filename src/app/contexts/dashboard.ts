import { createContext } from 'react';

type DashboardContextProps = {
  onCreateStrategyOpen: () => void;
};

const DashboardContext = createContext<DashboardContextProps>({
  onCreateStrategyOpen: () => undefined,
});

export default DashboardContext;