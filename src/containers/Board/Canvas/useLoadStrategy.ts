/* eslint-disable no-restricted-syntax */
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { Elements } from 'react-flow-renderer';

import fetcher from 'app/fetcher';

import { URLParams, Inputs } from './index.types';

const POST_LOAD_STRATEGY_500 = 'There was an error loading your strategy. Please refresh the page.';

// Types
interface State {
  isLoaded: boolean;
  inputs: Inputs;
  outputs: Record<any, any> | {};
}

interface GetStrategyResponse {
  elements: Elements;
  inputs: Inputs;
  outputs: Record<any, any> | {};
}

export default function useLoadStrategy() {
  const [elements, setElements] = useState<Elements>([]);
  const [state, setState] = useState<State>({
    isLoaded: false,
    inputs: {},
    outputs: {},
  });
  const toast = useToast();
  const { strategyId } = useParams<URLParams>();

  const fetchData = useCallback(async () => {
    try {
      const getStrategyResponse = await fetcher.get(`/strategy/${strategyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (getStrategyResponse.status === 200) {
        const response: GetStrategyResponse = getStrategyResponse.data;
        setState(() => {
          setElements(response.elements);

          return {
            isLoaded: true,
            inputs: response.inputs,
            outputs: response.outputs,
          };
        });
      } else {
        throw new Error(POST_LOAD_STRATEGY_500);
      }
    } catch (e) {
      toast({
        title: POST_LOAD_STRATEGY_500,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      setState(() => {
        setElements([]);

        return {
          isLoaded: true,
          inputs: {},
          outputs: {},
        };
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId]);

  return {
    ...state,
    elements,
    setElements,
  };
}
