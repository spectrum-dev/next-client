import { useContext, useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import {
  isNode, isEdge,
} from 'react-flow-renderer';

import fetcher from 'app/fetcher';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import {
  Inputs, Elements, Edge, FormBlockValues,
} from './index.types';

const NON_NODE_OR_EDGE_VALUE = 'There was an error validating this strategy. Please try again.';
const POST_RUN_STRATEGY_500 = 'There was an error validating this strategy. Please try again.';

const BreakException = {};

export type EdgeValidation = Record<string, {
  status: boolean,
  target_block: string,
  allowed_connections: Array<string>,
}>;

interface State {
  isValid: boolean;
  edgeValidation: EdgeValidation;
}

interface ValidateResponse {
  valid: boolean;
  edges: EdgeValidation;
}

export default function useValidateStrategy(
  { inputs, elements }: { inputs: Inputs, elements: Elements },
) {
  const [state, setState] = useState<State>({
    isValid: false,
    edgeValidation: {},
  });
  const { setStrategyType } = useContext(BoardContext);

  const toast = useToast();

  const checkInputsValid = (blockInputs: FormBlockValues) => {
    for (const blockInput of Object.keys(blockInputs)) {
      if (
        blockInput !== 'blockType'
        && blockInput !== 'blockId'
        && blockInputs?.[blockInput].value === ''
      ) {
        return false;
      }
    }
    return true;
  };

  const fetchData = useCallback(async () => {
    try {
      const nodeList: Inputs = {};
      const edgeList: Array<Edge> = [];
      for (const element of elements) {
        if (isNode(element)) {
          if (element.id.split('-').length === 1) {
            console.log(element);
            if (!checkInputsValid(inputs[element.id])) {
              // eslint-disable-next-line @typescript-eslint/no-throw-literal
              throw BreakException;
            }

            // @ts-ignore
            if (element?.data?.metadata?.blockType === 'BULK_DATA_BLOCK') {
              setStrategyType('SCREENER');
            } else {
              setStrategyType('BACKTEST');
            }

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

      const validateResponse = await fetcher.post('/orchestration/validate', requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (validateResponse.status === 200) {
        const response: ValidateResponse = validateResponse.data;
        setState((elems) => ({
          ...elems,
          isValid: response.valid,
          edgeValidation: response.edges,
        }));
      } else {
        throw new Error(POST_RUN_STRATEGY_500);
      }
    } catch (e) {
      if (e !== BreakException) {
        toast({
          title: POST_RUN_STRATEGY_500,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      setState((elems) => ({
        ...elems, isValid: false,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  useEffect(() => {
    if (
      (elements && elements.length > 0)
      && (inputs && Object.keys(inputs).length > 0)
    ) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return state;
}
