/* eslint-disable no-restricted-syntax */
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import fetcher from 'app/fetcher';

const POST_LOAD_STRATEGY_500 = 'There was an error loading your strategy. Please refresh the page.';

interface State {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  inputs: Record<any, any> | {};
  outputs: Record<any, any> | {};
}

export default function useLoadStrategy() {
  const [elements, setElements] = useState<Array<any>>([]);
  const [state, setState] = useState<State>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    inputs: {},
    outputs: {},
  });
  const toast = useToast();

  const { strategyId } = useParams<any>();

  const fetchData = useCallback(async () => {
    try {
      const getStrategyResponse = await fetcher.get(`/strategy/${strategyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (getStrategyResponse.status === 200) {
        // @ts-ignore
        setState(() => {
          setElements(getStrategyResponse.data?.elements);

          return {
            isLoading: false,
            isLoaded: true,
            hasError: false,
            inputs: getStrategyResponse.data?.inputs,
            outputs: getStrategyResponse.data?.outputs,
          };
        });
      } else {
        throw new Error(POST_LOAD_STRATEGY_500);
      }
    } catch (e) {
      setState(() => {
        setElements([]);
        return {
          isLoading: false,
          isLoaded: true,
          hasError: true,
          inputs: {},
          outputs: {},
        };
      });
      toast({
        title: POST_LOAD_STRATEGY_500,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
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
