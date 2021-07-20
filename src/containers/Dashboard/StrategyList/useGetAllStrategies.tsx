import { useCallback, useState, useEffect } from 'react';

import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const GET_ALL_STRATEGIES_RESPONSE_500 = 'There was an error retrieving your strategies. Please try again.';

export default function useGetAllStrategies() {
  const [state, setState] = useState<Array<Record<string, string>>>([]);

  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const getStrategiesResponse = await fetcher('/strategy/getStrategies', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (getStrategiesResponse.status === 200) {
        setState(getStrategiesResponse?.data?.strategies);
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

      setState([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, setState];
}
