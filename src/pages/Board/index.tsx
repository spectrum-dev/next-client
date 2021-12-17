import { useState } from 'react';
import { Flex } from '@chakra-ui/react';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import { StrategyType } from '../../containers/Board/Canvas/index.types';

import Canvas from './Canvas';
// import SharingModal from 'containers/Board/SharingModal';

const Board = () => {
  const [strategyType, setStrategyType] = useState<StrategyType>('PENDING');

  return (
    <BoardContext.Provider value={{
      strategyType,
      setStrategyType,
    }}>
      <Flex direction="column" height="100vh">
        <Canvas />
      </Flex>
    </BoardContext.Provider>
  );
};

export default Board;
