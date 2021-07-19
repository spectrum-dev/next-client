import { useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import fetcher from 'app/fetcher';

const STRATEGY_SAVE_SUCCESS = 'Your strategy has been saved successfully';
const GET_COMMIT_ID_ERROR = 'There was an error getting the commit ID. Please refresh the page.';
const POST_SAVE_STRATEGY_ERROR = 'There was an error saving the strategy. Please try again.';

interface State {
  isLoading: boolean;
  hasError: boolean;
  hasSaved: boolean | undefined;
}

export default function useSaveStrategy(
  { inputs, outputs, elements }:
  { inputs: Record<any, any>, outputs: any, elements: Array<Record<any, any>> },
) {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
    hasSaved: undefined,
  });
  const toast = useToast();

  const { strategyId } = useParams<any>();

  const saveStrategy = useCallback(async () => {
    try {
      const commitIdResponse = await fetcher.get(`/strategy/${strategyId}/commitId`);

      if (commitIdResponse.status === 200) {
        const saveStrategyRequestBody = {
          metadata: elements,
          inputs,
          outputs,
        };

        const saveStrategyResponse = await fetcher.post(`/strategy/${strategyId}/${commitIdResponse?.data?.commitId}`, saveStrategyRequestBody);

        if (saveStrategyResponse.status === 200) {
          toast({
            title: STRATEGY_SAVE_SUCCESS,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
          setState({
            isLoading: false,
            hasError: false,
            hasSaved: true,
          });
        } else {
          throw new Error(POST_SAVE_STRATEGY_ERROR);
        }
      } else {
        throw new Error(GET_COMMIT_ID_ERROR);
      }
    } catch (e) {
      toast({
        title: POST_SAVE_STRATEGY_ERROR,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      setState({ isLoading: false, hasError: true, hasSaved: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, inputs, outputs, strategyId]);

  return {
    ...state,
    saveStrategy,
  };
}
