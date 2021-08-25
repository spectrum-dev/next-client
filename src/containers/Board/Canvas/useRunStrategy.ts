import { useCallback, useState, useEffect } from 'react';
import {
  useMutation, useQuery,
} from '@apollo/client';

import {
  isNode, isEdge, Elements, Edge,
} from 'react-flow-renderer';

import { Outputs } from './index.types';

// Queries & Mutations
import {
  DISPATCH_RUN_STRATEGY,
  QUERY_TASK_RESULT,
} from './gql';

const NON_NODE_OR_EDGE_VALUE = 'There was an error running this strategy. Please try again.';

interface State {
  outputs: Outputs;
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
    loadedOutputs: Outputs,
    elements: Elements,
    isStrategyLoaded: boolean
  },
) {
  const [startPolling, setStartPolling] = useState<boolean>(false);
  const [initializer, setInitializer] = useState<boolean>(false);
  const [state, setState] = useState<State>({
    outputs: {},
    showResults: false,
  });

  // Triggered when loading data into the board
  useEffect(() => {
    if (isStrategyLoaded) {
      if (!initializer) {
        setState(() => {
          setInitializer(true);
          if (loadedOutputs) {
            return {
              outputs: loadedOutputs,
              showResults: 'results' in loadedOutputs,
            };
          }
          return {
            outputs: {},
            showResults: false,
          };
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
    const nodeList: any = {};
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
        setState({ outputs: data.taskResult.output, showResults: 'result' in data.taskResult.output });
        setStartPolling(false);
        break;
      case 'FAILURE':
        setStartPolling(false);
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
    ...state,
    invokeRun: fetchData,
  };
}
