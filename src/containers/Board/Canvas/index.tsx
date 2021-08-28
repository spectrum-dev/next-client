import { useState } from 'react';
import { Box, Center, useDisclosure } from '@chakra-ui/react';

import ReactFlow, {
  ReactFlowProvider, Background, addEdge, Edge, Connection, OnLoadParams, Node,
} from 'react-flow-renderer';

// Contexts
import BoardContext from 'app/contexts/board';

// Utils
import { checkBlockType } from 'containers/Board/utils';

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
import useInputManager from './useInputManager';
import useSaveStrategy from './useSaveStrategy';
import useValidateStrategy from './useValidateStrategy';
import useRunStrategy from './useRunStrategy';
import useVisualizationEngine from './useVisualizationEngine';

const Canvas = () => {
  const {
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

  const { isValid, edgeValidation } = useValidateStrategy({ inputs, elements });
  const { outputs, invokeRun, showResults } = useRunStrategy(
    {
      inputs, elements, loadedOutputs, isStrategyLoaded,
    },
  );

  useVisualizationEngine({
    outputs, setElements, reactFlowInstance,
  });

  const { saveStrategy } = useSaveStrategy({ elements, inputs, outputs });

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

  const onConnect = (params: Edge<any> | Connection) => {
    setElements((els) => {
      const blockType = checkBlockType(params.target);
      switch (blockType) {
        case 'FLOW_BLOCK':
          return addEdge({ ...params, type: 'flowEdge' }, els);
        case 'VISUALIZATION_BLOCK':
          // TODO: Determine how to push multiple lines here
          setInputs((inp: any) => {
            const { source, target } = params;
            let ref = inp?.[String(target)]?.ref;
            if (Array.isArray(ref)) {
              if (source && !(ref.indexOf(source) !== -1)) {
                ref.push(source);
              }
            } else {
              ref = [source];
            }
            return {
              ...inp,
              [String(target)]: {
                ...inp?.[String(target)],
                ref,
              },
            };
          });
          return addEdge({ ...params, type: 'visualizationEdge' }, els);
        default:
          return els;
      }
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

  return (
    <Box minH="100vh" h="100vh" as="section">
      <ReactFlowProvider>
        <BoardContext.Provider value={{
          inputs, setInputs, edgeValidation, outputs,
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
            // Canvas Formating
            maxZoom={0.5}
            zoomOnScroll={false}
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
