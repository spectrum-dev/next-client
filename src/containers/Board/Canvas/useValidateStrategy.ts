/* eslint-disable no-restricted-syntax */
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { isNode, isEdge, Elements } from 'react-flow-renderer';

import fetcher from 'app/fetcher';

const NON_NODE_OR_EDGE_VALUE = 'There was an error validating this strategy. Please try again.';
const POST_RUN_STRATEGY_500 = 'There was an error validating this strategy. Please try again.';

const BreakException = {};

type EdgeValidation = Record<string, {
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
  { inputs, elements }: { inputs: Record<any, any>, elements: Elements },
) {
  const [state, setState] = useState<State>({
    isValid: false,
    edgeValidation: {},
  });
  const toast = useToast();

  const checkInputsValid = (blockInputs: any) => {
    for (const blockInput of Object.keys(blockInputs)) {
      if (blockInput !== 'blockType' && blockInput !== 'blockId' && blockInputs?.[blockInput]?.value === '') {
        return false;
      }
    }
    return true;
  };

  const fetchData = useCallback(async () => {
    try {
      const nodeList: any = {};
      const edgeList = [];
      for (const element of elements) {
        if (isNode(element)) {
          if (element?.id.split('-').length === 1) {
            if (!checkInputsValid(inputs[element.id])) {
              // eslint-disable-next-line @typescript-eslint/no-throw-literal
              throw BreakException;
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
        setState({ isValid: response.valid, edgeValidation: response.edges });
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
