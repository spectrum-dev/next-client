/* eslint-disable no-restricted-syntax */
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { isNode, isEdge, Elements } from 'react-flow-renderer';

import fetcher from 'app/fetcher';

const NON_NODE_OR_EDGE_VALUE = 'There was an error validating this strategy. Please try again.';
const POST_RUN_STRATEGY_500 = 'There was an error validating this strategy. Please try again.';

const BreakException = {};
interface State {
  isLoading: boolean;
  hasError: boolean;
  isValid: boolean;
  edgeValidation: Record<string, Boolean>;
}

export default function useValidateStrategy(
  { inputs, elements }: { inputs: Record<any, any>, elements: Elements },
) {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
    isValid: false,
    edgeValidation: {},
  });
  const toast = useToast();

  const checkInputsValid = (blockInputs: any) => {
    for (const blockInput of Object.keys(blockInputs)) {
      // @ts-ignore
      if (blockInput !== 'blockType' && blockInput !== 'blockId' && blockInputs?.[blockInput]?.value === '') {
        return false;
      }
    }
    return true;
  };

  const fetchData = useCallback(async () => {
    try {
      const nodeList = {};
      const edgeList = [];
      for (const element of elements) {
        if (isNode(element)) {
          if (element?.id.split('-').length === 1) {
            if (!checkInputsValid(inputs[element?.id])) {
              // eslint-disable-next-line @typescript-eslint/no-throw-literal
              throw BreakException;
            }
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

      const runResponse = await fetcher.post('/orchestration/validate', requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (runResponse.status === 200) {
        setState((elems) => ({
          ...elems, isValid: runResponse.data?.valid, edgeValidation: runResponse.data?.edges,
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
      setState((elems: any) => ({
        ...elems, isLoading: false, hasError: true, isValid: false,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  useEffect(() => {
    if (
      (elements && elements.length > 0)
      // @ts-ignore
      && (inputs && Object.keys(inputs).length > 0)
    ) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return state;
}
