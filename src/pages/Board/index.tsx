import { useState } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';

import SplitPane from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import { StrategyType } from '../../containers/Board/Canvas/index.types';

import Canvas from './Canvas';
import Sidebar from './Sidebar';
// import SharingModal from 'containers/Board/SharingModal';

const Board = () => {
  const [strategyType, setStrategyType] = useState<StrategyType>('PENDING');
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isRunOpen, onClose: onRunClose, onToggle: onRunToggle } = useDisclosure();

  return (
    <BoardContext.Provider value={{
      strategyType,
      setStrategyType,
      isRunOpen,
      onRunToggle,
      onRunClose,
      onEditOpen,
      onEditClose,
    }}>
      <Flex direction="column" height="100vh">
        <SplitPane
          percentage={false}
          secondaryInitialSize={300}
        >
          {
            isEditOpen && (
              <SplitPane>
                <div> Pane 1 </div>
              </SplitPane>
            )
          }
          <Canvas />
          {
            isRunOpen && (
              <SplitPane>
                <Sidebar />
              </SplitPane>
            )
          }
        </SplitPane>
      </Flex>
    </BoardContext.Provider>
  );
};

export default Board;
