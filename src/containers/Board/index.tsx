import { useState } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import { StrategyType } from '../../pages/Board/Canvas/index.types';

// import Canvas from './Canvas';
import TopBar from './TopBar';
import SharingModal from './SharingModal';

const Board = () => {
  const [strategyType, setStrategyType] = useState<StrategyType>('PENDING');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <BoardContext.Provider value={{
      strategyType,
      setStrategyType,
    }}>
      <Flex direction="column" height="100vh">
        <Flex align="center" bg="#212B3B" color="white" px="6" minH="12" textAlign="center">
          <TopBar onShareOpen={onOpen} />
        </Flex>
        {/* <Canvas /> */}
        <SharingModal isOpen={isOpen} onClose={onClose}/>
      </Flex>
    </BoardContext.Provider>
  );
};

export default Board;
