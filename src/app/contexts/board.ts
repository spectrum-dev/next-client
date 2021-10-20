import { createContext } from 'react';

import { StrategyType } from '../../containers/Board/Canvas/index.types';

type BoardContextProps = {
  strategyType: StrategyType;
  setStrategyType: React.Dispatch<React.SetStateAction<StrategyType>>;
};

const BoardContext = createContext<BoardContextProps>({
  strategyType: 'PENDING',
  setStrategyType: () => undefined,
});

export default BoardContext;