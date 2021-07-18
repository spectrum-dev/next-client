/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';

import ReactFlow, { ReactFlowProvider, Background } from 'react-flow-renderer';

// Canvas Components
import Controls from './Controls';
import SideDrawer from './SideDrawer';

// Blocks
import Block from './Block';

// Hooks
import useBlockMetadataOnDrop from './SideDrawer/useBlockMetadataOnDrop';
import useLoadStrategy from './useLoadStrategy';
import useInputManager from './useInputManager';

const Canvas = () => {
  const {
    elements, setElements,
    inputs: loadedInputs,
    isLoaded: isStrategyLoaded,
  } = useLoadStrategy();
  const [reactFlowInstance, setReactFlowInstance] = useState();
  const [nodeTypes] = useState({
    block: Block,
  });
  const { inputs, setInputs, startId } = useInputManager(
    { elements, loadedInputs, isStrategyLoaded },
  );

  const {
    isOpen: isSideDrawerOpen,
    onOpen: onSideDrawerOpen,
    onClose: onSideDrawerClose,
  } = useDisclosure();

  // Boilerplate
  const { onDrop } = useBlockMetadataOnDrop({ startId });

  const onDragOver = (event: any) => {
    event.preventDefault();
  };

  const onLoad = (_reactFlowInstance: any) => {
    setReactFlowInstance(_reactFlowInstance);
  };

  return (
    <Box minH="100vh" h="100vh" as="section">
      <ReactFlowProvider>
        <ReactFlow
          elements={elements}
          // Element Types
          nodeTypes={nodeTypes}
          // Functions
          onDrop={(event) => { onDrop(event, reactFlowInstance, setElements); }}
          onDragOver={onDragOver}
          onLoad={onLoad}
          // Canvas Formating
          minZoom={0.5}
          maxZoom={0.5}
          defaultZoom={0.5}
          snapToGrid
          snapGrid={[1, 1]}
        >
          <Background
            // @ts-ignore
            variant="lines"
            color="#5c6874"
            gap={80}
            style={{ backgroundColor: '#212B3B' }}
          />
        </ReactFlow>
        <Controls onViewBlocks={onSideDrawerOpen} />
        <SideDrawer
          isOpen={isSideDrawerOpen}
          onClose={onSideDrawerClose}
        />
      </ReactFlowProvider>
    </Box>
  );
};

export default Canvas;
