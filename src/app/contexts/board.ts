import { createContext } from 'react';

import { StrategyType } from '../../containers/Board/Canvas/index.types';

type BoardContextProps = {
  strategyType: StrategyType;
  setStrategyType: React.Dispatch<React.SetStateAction<StrategyType>>;
  onRunToggle?: () => void;
  isRunOpen?: boolean,
  onRunClose?: () => void;
  onEditOpen?: () => void;
  onEditClose?: () => void;
};

const BoardContext = createContext<BoardContextProps>({
  strategyType: 'PENDING',
  setStrategyType: () => undefined,
  isRunOpen: false,
  onRunToggle: () => undefined,
  onRunClose: () => undefined,
  onEditOpen: () => undefined,
  onEditClose: () => undefined,
});

export default BoardContext;