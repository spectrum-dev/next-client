import { useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';

import ReactFlow, {
  ReactFlowProvider, Background, addEdge, Edge, Connection,
} from 'react-flow-renderer';

// Contexts
import InputContext from 'app/contexts/input';

// Canvas Components
import Controls from './Controls';
import SideDrawer from './SideDrawer';

// Blocks
import Block from './Block';
import VisualizationBlock from './VisualizationBlock';

// Edges
import FlowEdge from './Edge/FlowEdge';
import VisualizationEdge from './Edge/VisualizationEdge';

// Hooks
import useBlockMetadataOnDrop from './SideDrawer/useBlockMetadataOnDrop';
import useLoadStrategy from './useLoadStrategy';
import useInputManager from './useInputManager';
import useSaveStrategy from './useSaveStrategy';
import useValidateStrategy from './useValidateStrategy';
import useRunStrategy from './useRunStrategy';
import useVisualizationEngine from './useVisualizationEngine';

const Canvas = () => {
  const {
    elements, setElements,
    inputs: loadedInputs,
    isLoaded: isStrategyLoaded,
  } = useLoadStrategy();
  const [reactFlowInstance, setReactFlowInstance] = useState();
  const [nodeTypes] = useState({
    block: Block,
    visualizationBlock: VisualizationBlock,
  });
  const [edgeTypes] = useState({
    flowEdge: FlowEdge,
    visualizationEdge: VisualizationEdge,
  });

  const { inputs, setInputs, startId } = useInputManager(
    { elements, loadedInputs, isStrategyLoaded },
  );

  const { isValid } = useValidateStrategy({ inputs, elements });
  const { outputs, invokeRun } = useRunStrategy({ inputs, elements });
  useVisualizationEngine({
    outputs, setElements, reactFlowInstance,
  });

  const { saveStrategy } = useSaveStrategy({ elements, inputs, outputs });

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

  const onConnect = (params: Edge<any> | Connection) => {
    setElements((els) => addEdge({ ...params, type: 'flowEdge' }, els));
  };

  const onLoad = (_reactFlowInstance: any) => {
    setReactFlowInstance(_reactFlowInstance);
  };

  const onNodeDragStop = (event: any, node: any) => {
    setElements((els) => els.map((el) => {
      if (el.id === node.id) {
        return node;
      }
      return el;
    }));
  };

  return (
    <Box minH="100vh" h="100vh" as="section">
      <ReactFlowProvider>
        <InputContext.Provider value={{ inputs, setInputs }}>
          <ReactFlow
            elements={elements}
            // Element Types
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            // Drag Functions
            onDrop={(event) => { onDrop(event, reactFlowInstance, setElements); }}
            onDragOver={onDragOver}
            // Connection Functions
            connectionLineComponent={FlowEdge}
            onConnect={onConnect}
            // Loading and Node Updating Functions
            onLoad={onLoad}
            onNodeDragStop={onNodeDragStop}
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
          <Controls
            onViewBlocks={onSideDrawerOpen}
            onSaveStrategy={saveStrategy}
            isStrategyValid={isValid}
            onRunStrategy={invokeRun}
          />
          <SideDrawer
            isOpen={isSideDrawerOpen}
            onClose={onSideDrawerClose}
          />
        </InputContext.Provider>
      </ReactFlowProvider>
    </Box>
  );
};

export default Canvas;
