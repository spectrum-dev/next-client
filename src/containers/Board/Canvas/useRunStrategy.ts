import { useCallback, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

import {
  isNode, isEdge, Elements, Edge,
} from 'react-flow-renderer';

import fetcher from 'app/fetcher';

import { URLParams, Outputs } from './index.types';

const NON_NODE_OR_EDGE_VALUE = 'There was an error running this strategy. Please try again.';
const POST_RUN_STRATEGY_500 = 'There was an error running this strategy. Please try again.';
const STRATEGY_RUN_SUCCESS = 'The strategy was run successfully.';

interface State {
  outputs: Outputs;
  showResults: boolean;
}

type RunResponse = { response: Outputs };

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
  const [initializer, setInitializer] = useState<boolean>(false);
  const [state, setState] = useState<State>({
    outputs: {},
    showResults: false,
  });
  const toast = useToast();

  const { strategyId } = useParams<URLParams>();

  const DISPATCH_RUN_STRATEGY = gql`
    mutation DISPATCH_RUN_STRATEGY($strategyId: ID!, $commitId: ID!, $metadata: JSON!, $inputs: JSON!, $nodeList: JSON!, $edgeList: [JSON!]) {
      dispatchRunStrategy(
        strategyId: $strategyId,
        commitId: $commitId,
        metadata: $metadata,
        inputs: $inputs,
        nodeList: $nodeList,
        edgeList: $edgeList
      ) {
        status
        taskId
      }
    }
  `;

  const [dispatchRunStrategy, { error }] = useMutation(DISPATCH_RUN_STRATEGY);

  const fetchData = useCallback(async () => {
    try {
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

      const requestBody = {
        nodeList,
        edgeList,
      };

      dispatchRunStrategy({
        variables: {
          strategyId,
          commitId: '95a61cc4-a8f8-41e2-85e0-15f994f98f2a',
          metadata: elements,
          inputs,
          nodeList,
          edgeList,
        },
      });

      const runResponse = await fetcher.post('/orchestration/run', requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (runResponse.status === 200) {
        const response: RunResponse = runResponse.data;

        toast({
          title: STRATEGY_RUN_SUCCESS,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });

        setState({ outputs: response.response, showResults: 'results' in response.response });
      } else {
        console.error(error);
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
        outputs: {},
        showResults: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, inputs]);

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

  return {
    ...state,
    invokeRun: fetchData,
  };
}
