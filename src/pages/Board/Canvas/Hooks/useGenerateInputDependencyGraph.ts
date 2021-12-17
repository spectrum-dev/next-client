import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useLazyQuery } from '@apollo/client';
import { isNode, isEdge } from 'react-flow-renderer';

import { QUERY_INPUT_DEPENDENCY_GRAPH } from '../gql';

// Types
import {
  Inputs, Elements, Edge,
} from '../index.types';

const NON_NODE_OR_EDGE_VALUE = 'There was an element in the list that is neither a node or edge';
const UNHANDLED_ERROR = 'There was an error generating the dependncy graph. Please try again.';

export default function useGenerateInputDependencyGraph(
  { elements, inputs, isStrategyLoaded }:
  { elements: Elements, inputs: Inputs, isStrategyLoaded: boolean },
) {
  const [initializer, setInitializer] = useState<boolean>(false);
  const toast = useToast();

  const [
    getInputDependencyGraph,
    { data: inputDependencyGraphData },
  ] = useLazyQuery(QUERY_INPUT_DEPENDENCY_GRAPH);

  const generateInputDependencyGraph = (
    { elementsOverride }:
    { elementsOverride: Elements | undefined },
  ) => {
    const runningElements = elementsOverride || elements;
    try {
      const nodeList: Inputs = {};
      const edgeList: Array<Edge> = [];

      for (const element of runningElements) {
        if (isNode(element)) {
          if (element?.id.split('-').length === 1) {
            nodeList[element.id] = inputs[element.id];
          }
        } else if (isEdge(element)) {
          if (element.target.split('-').length === 1) {
            edgeList.push(element);
          }
        } else {
          throw new Error(NON_NODE_OR_EDGE_VALUE);
        }
      }

      getInputDependencyGraph({ variables: { nodeList, edgeList } });
    } catch (e) {
      toast({
        title: UNHANDLED_ERROR,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  useEffect(() => {
    if (!initializer && isStrategyLoaded && inputs && Object.keys(inputs).length > 0) {
      generateInputDependencyGraph({ elementsOverride: undefined });
      setInitializer(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return {
    generateInputDependencyGraph,
    inputDependencyGraph: inputDependencyGraphData?.inputDependencyGraph || {},
  };
}
