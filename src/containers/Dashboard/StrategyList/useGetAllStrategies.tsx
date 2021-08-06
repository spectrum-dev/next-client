import { useCallback, useState, useEffect } from 'react';

import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const GET_ALL_STRATEGIES_RESPONSE_500 = 'There was an error retrieving your strategies. Please try again.';

interface GetStrategyRecordResponse {
  strategy_id: string;
  strategy_name: string;
  created_at: string;
}

export type GetStrategyArrayResponse = Array<GetStrategyRecordResponse> | [];

interface GetStrategyResponse {
  strategies: Array<GetStrategyRecordResponse>
}

export default function useGetAllStrategies() {
  const [allStrategies, setAllStrategies] = useState<GetStrategyArrayResponse>([]);

  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const getStrategiesResponse = await fetcher('/strategy/getStrategies', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (getStrategiesResponse.status === 200) {
        const response: GetStrategyResponse = getStrategiesResponse.data;
        setAllStrategies(response.strategies);
      } else {
        throw new Error(GET_ALL_STRATEGIES_RESPONSE_500);
      }
    } catch (e) {
      toast({
        title: GET_ALL_STRATEGIES_RESPONSE_500,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      setAllStrategies([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allStrategies, setAllStrategies };
}
