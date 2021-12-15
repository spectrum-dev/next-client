import { useState } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';

import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import { StrategyType } from '../../containers/Board/Canvas/index.types';

import Canvas from './Canvas';
// import SharingModal from 'containers/Board/SharingModal';

const Board = () => {
  const [strategyType, setStrategyType] = useState<StrategyType>('PENDING');
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isRunOpen, onToggle: onRunToggle } = useDisclosure();

  return (
    <BoardContext.Provider value={{
      strategyType,
      setStrategyType,
      isRunOpen,
      onRunToggle,
      onEditOpen,
      onEditClose,
    }}>
      <Flex direction="column" height="100vh">
        <SplitterLayout>
          {
            isEditOpen && (
              <div> Pane 1 </div> 
            )
          }
          <Canvas />
          {
            isRunOpen && (
              <div> Pane 2 </div>
            )
          }
        </SplitterLayout>
      </Flex>
    </BoardContext.Provider>
  );
};

export default Board;
