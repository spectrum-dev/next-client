/* eslint-disable no-restricted-syntax */
import { useCallback, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { isNode, isEdge, Elements } from 'react-flow-renderer';

import fetcher from 'app/fetcher';

const NON_NODE_OR_EDGE_VALUE = 'There was an error running this strategy. Please try again.';
const POST_RUN_STRATEGY_500 = 'There was an error running this strategy. Please try again.';
const STRATEGY_RUN_SUCCESS = 'The strategy was run successfully.';

interface State {
  isLoading: boolean;
  hasError: boolean;
  invokeRun: Function | undefined;
  outputs: Record<any, any> | undefined;
  showResults: boolean;
}

export default function useRunStrategy(
  {
    inputs,
    elements,
    loadedOutputs,
    isStrategyLoaded,
  }:
  {
    inputs: Record<any, any>,
    loadedOutputs: any,
    elements: Elements,
    isStrategyLoaded: boolean
  },
) {
  const [initializer, setInitializer] = useState<Boolean>(false);
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
    invokeRun: undefined,
    outputs: {},
    showResults: false,
  });
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const nodeList = {};
      const edgeList = [];
      for (const element of elements) {
        if (isNode(element)) {
          if (element?.id.split('-').length === 1) {
            // @ts-ignore
            nodeList[element?.id] = inputs[element?.id];
          }
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

      const runResponse = await fetcher.post('/orchestration/run', requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (runResponse.status === 200) {
        toast({
          title: STRATEGY_RUN_SUCCESS,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        // TODO: Having an issue with outputs being undefined
        if (runResponse?.data?.response) {
          setState((elems) => ({ ...elems, outputs: runResponse?.data?.response, showResults: Object.keys(runResponse?.data?.response).includes('results') }));
        } else {
          setState((elems) => ({
            ...elems,
            outputs: runResponse?.data?.response,
            showResults: false,
          }));
        }
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
        isLoading: false,
        hasError: true,
        invokeRun: undefined,
        outputs: undefined,
        showResults: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, inputs]);

  useEffect(() => {
    if (isStrategyLoaded) {
      if (!initializer) {
        setState((els: any) => {
          setInitializer(true);
          if (loadedOutputs) {
            return {
              ...els,
              outputs: loadedOutputs,
              showResults: Object.keys(loadedOutputs).includes('results'),
            };
          }
          return {};
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedOutputs, isStrategyLoaded]);

  return {
    ...state,
    invokeRun: fetchData,
  };
}
