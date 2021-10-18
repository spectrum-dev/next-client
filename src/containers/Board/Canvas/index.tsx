import { useState } from 'react';
import { Flex, Text, Box, Center, useDisclosure } from '@chakra-ui/react';
import ReactFlow, {
  ReactFlowProvider, Background, addEdge,
  Connection, OnLoadParams, BackgroundVariant,
} from 'react-flow-renderer';

// Contexts
import BoardContext from 'app/contexts/board';

// Canvas Components
import Controls from './Controls';
import SideDrawer from './SideDrawer';
import ResultsDrawer from './ResultsDrawer';

// Blocks
import Block from './blocks/Block';
import VisualizationBlock from './blocks/VisualizationBlock';
import ResultBlock from './blocks/ResultBlock';
import ResultsGraphBlock from './blocks/ResultsGraphBlock';
import ResultTableBlock from './blocks/ResultsTableBlock';

// Edges
import FlowEdge from './Edge/FlowEdge';
import VisualizationEdge from './Edge/VisualizationEdge';

// Hooks
import useBlockMetadataOnDrop from './SideDrawer/useBlockMetadataOnDrop';
import useResultsOnDrop from './ResultsDrawer/useResultsOnDrop';
import useLoadStrategy from './useLoadStrategy';
import useOnNodeContextMenu from './useOnNodeContextMenu';
import useInputManager from './useInputManager';
import useSaveStrategy from './useSaveStrategy';
import useValidateStrategy from './useValidateStrategy';
import useRunStrategy from './useRunStrategy';
import useVisualizationEngine from './useVisualizationEngine';
import useGenerateInputDependencyGraph from './useGenerateInputDependencyGraph';

// Types
import {
  Edge, Node,
} from './index.types';

const Canvas = () => {
  const {
    hasAccess,
    elements, setElements,
    inputs: loadedInputs,
    outputs: loadedOutputs,
    isLoaded: isStrategyLoaded,
  } = useLoadStrategy();

  const [reactFlowInstance, setReactFlowInstance] = useState<OnLoadParams>();
  const [nodeTypes] = useState({
    block: Block,
    visualizationBlock: VisualizationBlock,
    resultBlock: ResultBlock,
    resultGraphBlock: ResultsGraphBlock,
    resultTableBlock: ResultTableBlock,
  });
  const [edgeTypes] = useState({
    flowEdge: FlowEdge,
    visualizationEdge: VisualizationEdge,
  });

  const { inputs, setInputs, startId } = useInputManager(
    { elements, loadedInputs, isStrategyLoaded },
  );

  const {
    generateInputDependencyGraph,
    inputDependencyGraph,
  } = useGenerateInputDependencyGraph({
    inputs,
    elements,
    isStrategyLoaded,
  });

  const { isValid, edgeValidation, strategyType } = useValidateStrategy({ inputs, elements });
  const {
    outputs, setOutputs, invokeRun, showResults,
  } = useRunStrategy(
    {
      inputs, elements, loadedOutputs, isStrategyLoaded, strategyType,
    },
  );

  useVisualizationEngine({
    outputs, setElements, reactFlowInstance,
  });

  const { saveStrategy } = useSaveStrategy({ elements, inputs, outputs });

  const { onNodeContextMenu } = useOnNodeContextMenu({ setElements });

  const {
    isOpen: isSideDrawerOpen,
    onOpen: onSideDrawerOpen,
    onClose: onSideDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isResultsDrawerOpen,
    onOpen: onResultsDrawerOpen,
    onClose: onResultsDrawerClose,
  } = useDisclosure();

  // Boilerplate
  const { onDrop: onBlockDrop } = useBlockMetadataOnDrop({ startId });
  const { onDrop: onResultsDrop } = useResultsOnDrop();

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const onConnect = (params: Edge | Connection) => {
    setElements((els) => {
      const updatedEls = addEdge({ ...params, type: 'flowEdge' }, els);
      generateInputDependencyGraph({ elementsOverride: updatedEls });
      return updatedEls;
    });
  };

  const onLoad = (params: OnLoadParams) => {
    setReactFlowInstance(params);
  };

  const onNodeDragStop = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
    setElements((els) => els.map((el) => {
      if (el.id === node.id) {
        return node;
      }
      return el;
    }));
  };

  if (isStrategyLoaded && !hasAccess) {
    return (
      <Flex minH="100vh" h="100vh" as="section" backgroundColor="#212B3B" justifyContent="center">
        <Center>
          <Text fontSize="xl" fontWeight="bold" color="white"> You are not authorized to view this strategy </Text>
        </Center>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" h="100vh" as="section">
      <ReactFlowProvider>
        <BoardContext.Provider value={{
          inputs,
          setInputs,
          setElements,
          setOutputs,
          edgeValidation,
          outputs,
          inputDependencyGraph,
        }}
        >
          <ReactFlow
            elements={elements}
            // Element Types
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            // Drag Functions
            onDrop={(event: React.DragEvent<HTMLDivElement>) => {
              onBlockDrop(event, reactFlowInstance, setElements);
              onResultsDrop(event, reactFlowInstance, setElements);
            }}
            onDragOver={onDragOver}
            // Connection Functions
            // @ts-ignore
            connectionLineComponent={FlowEdge}
            onConnect={onConnect}
            // Loading and Node Updating Functions
            onLoad={onLoad}
            onNodeDragStop={onNodeDragStop}
            // Context Menu
            onNodeContextMenu={onNodeContextMenu}
            // Canvas Formating
            maxZoom={0.5}
            zoomOnScroll={false}
            defaultZoom={0.5}
            snapToGrid
            snapGrid={[1, 1]}
          >
            <Background
              variant={BackgroundVariant.Lines}
              color="#5c6874"
              gap={80}
              style={{ backgroundColor: '#212B3B' }}
            />
          </ReactFlow>
          <Center>
            <Controls
              onViewBlocks={onSideDrawerOpen}
              showResults={showResults}
              onResultsPane={onResultsDrawerOpen}
              onSaveStrategy={saveStrategy}
              hasStartedStrategy={elements.length !== 0}
              isStrategyValid={isValid}
              onRunStrategy={invokeRun}
            />
          </Center>
          <SideDrawer
            isOpen={isSideDrawerOpen}
            onClose={onSideDrawerClose}
          />
          <ResultsDrawer
            isOpen={isResultsDrawerOpen}
            onClose={onResultsDrawerClose}
            outputs={outputs}
          />
        </BoardContext.Provider>
      </ReactFlowProvider>
    </Box>
  );
};

export default Canvas;
