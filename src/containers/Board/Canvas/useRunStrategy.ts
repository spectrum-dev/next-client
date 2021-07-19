/* eslint-disable no-restricted-syntax */
import { useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { isNode, isEdge } from 'react-flow-renderer';

import fetcher from 'app/fetcher';

const NON_NODE_OR_EDGE_VALUE = 'There was an error running this strategy. Please try again.';
const POST_RUN_STRATEGY_500 = 'There was an error running this strategy. Please try again.';

interface State {
  isLoading: boolean;
  hasError: boolean;
  invokeRun: Function | undefined;
  outputs: Record<any, any> | undefined;
}

export default function useRunStrategy(
  { inputs, elements }: { inputs: Record<any, any>, elements: Array<Record<any, any>> },
) {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
    invokeRun: undefined,
    outputs: {},
  });
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const nodeList = {};
      const edgeList = [];
      for (const element of elements) {
        // @ts-ignore
        if (isNode(element)) {
          if (element?.id.split('-').length === 1) {
            // @ts-ignore
            nodeList[element?.id] = inputs[element?.id];
          }
          // @ts-ignore
        } else if (isEdge(element)) {
          if (element?.target.split('-').length === 1) {
            edgeList.push(element);
          }
        } else {
          throw new Error(NON_NODE_OR_EDGE_VALUE);
        }
      }

      const requestBody = {
        nodeList,
        edgeList,
      };

      const runResponse = await fetcher.post('/orchestration/run', requestBody);

      if (runResponse.status === 200) {
        setState((elems) => ({ ...elems, outputs: runResponse?.data?.response }));
      } else {
        throw new Error(POST_RUN_STRATEGY_500);
      }
    } catch (e) {
      toast({
        title: POST_RUN_STRATEGY_500,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setState({
        isLoading: false, hasError: true, invokeRun: undefined, outputs: undefined,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, inputs]);

  return {
    ...state,
    invokeRun: fetchData,
  };
}
