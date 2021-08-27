import { useToast } from '@chakra-ui/react';
import { useLazyQuery } from '@apollo/client';
import {
  Elements, Edge, isNode, isEdge,
} from 'react-flow-renderer';

import { QUERY_INPUT_DEPENDENCY_GRAPH } from './gql';

const NON_NODE_OR_EDGE_VALUE = 'There was an element in the list that is neither a node or edge';
const UNHANDLED_ERROR = 'There was an error generating the dependncy graph. Please try again.';

export default function useGenerateInputDependencyGraph() {
  const toast = useToast();

  const [
    getInputDependencyGraph,
    { data: inputDependencyGraphData },
  ] = useLazyQuery(QUERY_INPUT_DEPENDENCY_GRAPH);

  const generateInputDependencyGraph = (
    { elements, inputs }:
    { elements: Elements, inputs: any },
  ) => {
    try {
      const nodeList: any = {};
      const edgeList: Array<Edge> = [];

      for (const element of elements) {
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
      console.error(e);
      toast({
        title: UNHANDLED_ERROR,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return {
    generateInputDependencyGraph,
    inputDependencyGraph: inputDependencyGraphData?.inputDependencyGraph || {},
  };
}
