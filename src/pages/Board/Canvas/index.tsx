/* eslint-disable */ 
import { useState, useContext } from 'react';
import { Flex, Text, Box, Center, useDisclosure } from '@chakra-ui/react';
import ReactFlow, {
  ReactFlowProvider, Background, addEdge,
  Connection, OnLoadParams, BackgroundVariant,
} from 'react-flow-renderer';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';

import 'react-reflex/styles.css';

// Contexts
import CanvasContext from 'app/contexts/canvas';
import BoardContext from 'app/contexts/board';

// Canvas Components
import Controls from '../../../containers/Board/Canvas/Controls';
import SideDrawer from '../../../containers/Board/Canvas/SideDrawer';
import ResultsDrawer from '../../../containers/Board/Canvas/ResultsDrawer';
import UserOptions from './UserOptions';
import Backtest from './Sidebars/Backtest';

// Blocks
import Block from '../../../containers/Board/Canvas/blocks/Block';
import VisualizationBlock from '../../../containers/Board/Canvas/blocks/VisualizationBlock';
import ResultBlock from '../../../containers/Board/Canvas/blocks/ResultBlock';
import ResultsGraphBlock from '../../../containers/Board/Canvas/blocks/ResultsGraphBlock';
import ResultTableBlock from '../../../containers/Board/Canvas/blocks/ResultsTableBlock';

// Edges
import FlowEdge from '../../../containers/Board/Canvas/Edge/FlowEdge';
import VisualizationEdge from '../../../containers/Board/Canvas/Edge/VisualizationEdge';

// Hooks
import useBlockMetadataOnDrop from '../../../containers/Board/Canvas/SideDrawer/useBlockMetadataOnDrop';
import useResultsOnDrop from '../../../containers/Board/Canvas/ResultsDrawer/useResultsOnDrop';
import useLoadStrategy from '../../../containers/Board/Canvas/useLoadStrategy';
import useOnNodeContextMenu from '../../../containers/Board/Canvas/useOnNodeContextMenu';
import useInputManager from '../../../containers/Board/Canvas/useInputManager';
import useSaveStrategy from '../../../containers/Board/Canvas/useSaveStrategy';
import useValidateStrategy from '../../../containers/Board/Canvas/useValidateStrategy';
import useRunStrategy from '../../../containers/Board/Canvas/useRunStrategy';
import useVisualizationEngine from '../../../containers/Board/Canvas/useVisualizationEngine';
import useGenerateInputDependencyGraph from '../../../containers/Board/Canvas/useGenerateInputDependencyGraph';

// Types
import {
  Edge, Node,
} from '../../../containers/Board/Canvas/index.types';


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

  const { isValid, edgeValidation } = useValidateStrategy({ inputs, elements });
  const { strategyType } = useContext(BoardContext);
  const {
    outputs, setOutputs, invokeRun, showResults, isLoading: isRunStrategyLoading,
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

  // const {
  //   isOpen: isSideDrawerOpen,
  //   onOpen: onSideDrawerOpen,
  //   onClose: onSideDrawerClose,
  // } = useDisclosure();

  // const {
  //   isOpen: isResultsDrawerOpen,
  //   onOpen: onResultsDrawerOpen,
  //   onClose: onResultsDrawerClose,
  // } = useDisclosure();

  const {
    isOpen: isSideDrawerOpen,
    onToggle: onSideDrawerToggle,
  } = useDisclosure();

  const {
    isOpen: isBacktestOpen,
    onClose: onBacktestClose,
    onToggle: onBacktestToggle,
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

  // if (isStrategyLoaded && !hasAccess) {
  //   return (
  //     <Flex minH="100vh" h="100vh" as="section" backgroundColor="#212B3B" justifyContent="center">
  //       <Center>
  //         <Text fontSize="xl" fontWeight="bold" color="white"> You are not authorized to view this strategy </Text>
  //       </Center>
  //     </Flex>
  //   );
  // }

  return (
    <ReactFlowProvider>
      <CanvasContext.Provider value={{
        inputs,
        setInputs,
        setElements,
        setOutputs,
        edgeValidation,
        outputs,
        inputDependencyGraph,
        isBacktestOpen,
        onBacktestToggle,
      }}
      >
        <ReflexContainer orientation="vertical">
          <ReflexElement className="middle-pane" minSize={1000}>
            <Box minH="100vh" h="100vh" as="section">
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
                  color="#E5E5E5"
                  gap={130}
                  style={{ backgroundColor: '#F2F2F2' }}
                />
              </ReactFlow>
              <UserOptions />
            </Box>
          </ReflexElement>
          
          <ReflexSplitter style={{ display: isBacktestOpen ? 'block' : 'none' }} />
          
          {
            isBacktestOpen && (
              <ReflexElement
                className="right-pane"
                style={{
                  display: isBacktestOpen ? 'block' : 'none',
                  visibility: isBacktestOpen ? 'visible' : 'hidden'
                }}
                minSize={300}
                >
                <Backtest onClose={onBacktestClose}/>
              </ReflexElement>
            )
          }
        <ReflexSplitter/>
      </ReflexContainer>
    </CanvasContext.Provider>
  </ReactFlowProvider>
  );
};

export default Canvas;
