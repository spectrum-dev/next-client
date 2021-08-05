import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import fetcher from 'app/fetcher';

const GET_STRATEGY_INFORMATION_404 = 'The strategy information could not be found. Please check the ID.';
const GET_STRATEGY_INFORMATION_500 = 'There was an error loading the strategy information. Please refresh the page.';

interface State {
  isLoading: boolean;
  hasError: boolean;
  strategyInformation: Record<string, string>;
}

export default function useGetStrategyInformation() {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
    strategyInformation: {},
  });
  const toast = useToast();

  const { strategyId } = useParams<any>();

  const fetchData = useCallback(async () => {
    try {
      const getStrategyInformationResponse = await fetcher.get(`/strategy/${strategyId}/detail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (getStrategyInformationResponse.status === 200) {
        // @ts-ignore
        setState({
          isLoading: false,
          hasError: false,
          strategyInformation: getStrategyInformationResponse.data,
        });
      } else if (getStrategyInformationResponse.status === 404) {
        throw new Error(GET_STRATEGY_INFORMATION_404);
      } else {
        throw new Error(GET_STRATEGY_INFORMATION_500);
      }
    } catch (e) {
      setState({
        isLoading: false,
        hasError: true,
        strategyInformation: {},
      });
      toast({
        title: GET_STRATEGY_INFORMATION_404,
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

  return state;
}
