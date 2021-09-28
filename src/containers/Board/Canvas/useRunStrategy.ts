import { useCallback, useState, useEffect } from 'react';
import {
  useMutation, useQuery,
} from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import {
  isNode, isEdge,
} from 'react-flow-renderer';

import {
  Outputs, Inputs, Elements, Edge,
} from './index.types';

// Queries & Mutations
import {
  DISPATCH_RUN_STRATEGY,
  QUERY_TASK_RESULT,
} from './gql';

const NON_NODE_OR_EDGE_VALUE = 'There was an error running this strategy. Please try again.';
const POST_RUN_STRATEGY_500 = 'There was an error running this strategy. Please try again.';
const STRATEGY_RUN_SUCCESS = 'The strategy was run successfully.';

export default function useRunStrategy(
  {
    inputs,
    elements,
    loadedOutputs,
    isStrategyLoaded,
  }:
  {
    inputs: Inputs,
    loadedOutputs: Outputs,
    elements: Elements,
    isStrategyLoaded: boolean
  },
) {
  const toast = useToast();

  const [startPolling, setStartPolling] = useState<boolean>(false);
  const [initializer, setInitializer] = useState<boolean>(false);
  const [outputs, setOutputs] = useState<Outputs>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // Triggered when loading data into the board
  useEffect(() => {
    if (isStrategyLoaded) {
      if (!initializer) {
        setOutputs(() => {
          setInitializer(true);
          if (loadedOutputs) {
            setShowResults('results' in loadedOutputs);
            return outputs;
          }
          setShowResults(false);
          return {};
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedOutputs, isStrategyLoaded]);

  // Dispatches async request to run strategy
  const [dispatchRunStrategy, { data: taskData }] = useMutation(DISPATCH_RUN_STRATEGY);

  /**
   * Function invoked to request data from API
   */
  const fetchData = useCallback(async () => {
    // Pre-processing to assemble a list of nodes and edges
    const nodeList: Inputs = {};
    const edgeList: Array<Edge> = [];
    for (const element of elements) {
      if (isNode(element)) {
        if (element.id.split('-').length === 1) {
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

    await dispatchRunStrategy({
      variables: {
        nodeList,
        edgeList,
      },
    });

    /**
     * When the dispatch function is hit, we want to start
     * polling the backend for the status of a running task
     */
    setStartPolling(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, inputs]);

  /**
   * The implementation for the onCompleted handler that checks, when the
   * response is SUCCESS, the output is put in state
   *
   * @param data Response data from query
   */
  const onCompleted = (data: any) => {
    switch (data.taskResult.status) {
      case 'SUCCESS':
        setOutputs(data.taskResult?.output);
        setShowResults('results' in data.taskResult?.output);
        setStartPolling(false);
        toast({
          title: STRATEGY_RUN_SUCCESS,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        break;
      case 'FAILURE':
        setStartPolling(false);
        toast({
          title: POST_RUN_STRATEGY_500,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        break;
      case 'PENDING':
        // Ensures logging for pending state (which is valid) is not misleading
        break;
      default:
        console.log('Unhandled State: ', data);
        break;
    }
  };

  /**
   * After the button has been clicked, the state of startPolling is set to true.
   * Now, the below hook will start polling at an interval of 2 seconds for the
   * task to complete, and when completed will return the response
   */
  useQuery(QUERY_TASK_RESULT, {
    variables: {
      taskId: taskData?.dispatchRunStrategy?.taskId || '',
    },
    notifyOnNetworkStatusChange: true,
    skip: !startPolling,
    pollInterval: !startPolling ? 0 : 2000,
    onCompleted,
    onError: () => setStartPolling(false),
  });

  return {
    outputs,
    setOutputs,
    showResults,
    invokeRun: fetchData,
  };
}
