/* eslint-disable */ 
import { useState, useContext } from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
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
import ResultsDrawer from '../../../containers/Board/Canvas/ResultsDrawer';
import UserOptions from './UserOptions';
import GenericSidebar from './Sidebars/GenericSidebar';
import BlockSelection from './Modals/BlockSelection';
import Sharing from './Modals/Sharing';

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
import useBlockMetadataOnDrop from './Modals/BlockSelection/useBlockMetadataOnDrop';
import useResultsOnDrop from '../../../containers/Board/Canvas/ResultsDrawer/useResultsOnDrop';
import useLoadStrategy from './Hooks/useLoadStrategy';
import useOnNodeContextMenu from './Hooks/useOnNodeContextMenu';
import useInputManager from './Hooks/useInputManager';
import useSaveStrategy from './Hooks/useSaveStrategy';
import useValidateStrategy from './Hooks/useValidateStrategy';
import useRunStrategy from './Hooks/useRunStrategy';
import useVisualizationEngine from './Hooks/useVisualizationEngine';
import useGenerateInputDependencyGraph from './Hooks/useGenerateInputDependencyGraph';
import useInputFields from './blocks/Block/useInputFields';

// Types
import {
  Edge, Node,
  SelectedBlock,
} from './index.types';


const Canvas = () => {
  const {
    hasAccess,
    elements, setElements,
    inputs: loadedInputs,
    outputs: loadedOutputs,
    isLoaded: isStrategyLoaded,
    strategyName,
    strategyId,
    commitId,
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

  useSaveStrategy({ elements, inputs, outputs, strategyId, commitId });

  const { onNodeContextMenu } = useOnNodeContextMenu({ setElements });
    
  const {
    isOpen: isBlockSelectionOpen,
    onClose: onBlockSelectionClose,
    onOpen: onBlockSelectionOpen,
  } = useDisclosure();

  const {
    isOpen: isSideDrawerOpen,
    onOpen: onSideDrawerOpen,
    onClose: onSideDrawerClose,
    onToggle: onSideDrawerToggle,
  } = useDisclosure();

  const {
    isOpen: isSharingOpen,
    onOpen: onSharingOpen,
    onClose: onSharingClose,
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

  const [selectedBlock, setSelectedBlock] = useState<SelectedBlock>({ id: '1', blockType: 'DATA_BLOCK', blockId: 1 })
  const { fields } = useInputFields({ ...selectedBlock, inputs, setInputs, inputDependencyGraph });

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
        strategyName,
        inputs,
        setInputs,
        setElements,
        setOutputs,
        edgeValidation,
        outputs,
        inputDependencyGraph,
        isBacktestOpen,
        onBacktestToggle,
        onBlockSelectionOpen,
        isSideDrawerOpen,
        onSideDrawerOpen,
        onSideDrawerToggle,
        onSharingOpen,
        setSelectedBlock,
      }}
      >          
        <ReflexContainer orientation="vertical">
          {
            isSideDrawerOpen && (
              <ReflexElement
                className="left-pane"
                style={{
                  display: isSideDrawerOpen ? 'block' : 'none',
                  visibility: isSideDrawerOpen ? 'visible' : 'hidden'
                }}
                minSize={300}
                maxSize={300}
                >
                <GenericSidebar title="Block Inputs" onClose={onSideDrawerClose}>
                  { fields }
                </GenericSidebar>
              </ReflexElement>
            )
          }

          <ReflexSplitter style={{ display: isSideDrawerOpen ? 'block' : 'none' }} />

          <ReflexElement className="middle-pane" minSize={1000} flex={1}>
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
                <GenericSidebar title="Form Data"  onClose={onBacktestClose}>
                  <Button colorScheme="green" disabled={!isValid || isRunStrategyLoading} onClick={() => invokeRun()}>
                    Run
                  </Button>
                </GenericSidebar>
              </ReflexElement>
            )
          }
      </ReflexContainer>
      <BlockSelection isOpen={isBlockSelectionOpen} onClose={onBlockSelectionClose} />
      <Sharing isOpen={isSharingOpen} onClose={onSharingClose} />
    </CanvasContext.Provider>
  </ReactFlowProvider>
  );
};

export default Canvas;
