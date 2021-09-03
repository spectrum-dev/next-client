import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import fetcher from 'app/fetcher';

import {
  URLParams, Inputs, Outputs, Elements,
} from './index.types';

const STRATEGY_SAVE_SUCCESS = 'Your strategy has been saved successfully';
const GET_COMMIT_ID_ERROR = 'There was an error getting the commit ID. Please refresh the page.';
const POST_SAVE_STRATEGY_ERROR = 'There was an error saving the strategy. Please try again.';

// Types
interface CommitIDResponse {
  strategyId: string;
  commitId: string;
}

interface SaveStrategyRequestBody {
  metadata: Elements;
  outputs: Outputs;
  inputs: Inputs;
}

export default function useSaveStrategy(
  { inputs, outputs, elements }:
  { inputs: Inputs, outputs: Outputs, elements: Elements },
) {
  const toast = useToast();

  const { strategyId } = useParams<URLParams>();

  const saveStrategy = useCallback(async () => {
    try {
      const commitIdResponse = await fetcher.get(`/strategy/${strategyId}/commitId`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (commitIdResponse.status === 200) {
        const response: CommitIDResponse = commitIdResponse.data;

        const saveStrategyRequestBody: SaveStrategyRequestBody = {
          metadata: elements,
          inputs,
          outputs,
        };

        const saveStrategyResponse = await fetcher.post(`/strategy/${response.strategyId}/${response.commitId}`,
          saveStrategyRequestBody, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });

        if (saveStrategyResponse.status === 200) {
          toast({
            title: STRATEGY_SAVE_SUCCESS,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, inputs, outputs, strategyId]);

  return { saveStrategy };
}
