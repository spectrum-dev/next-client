import { useCallback, useState, useEffect } from 'react';

import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

interface State {
  allStrategies: Array<any>;
  hasError: Boolean;
}

const GET_ALL_STRATEGIES_RESPONSE_500 = 'There was an error retrieving your strategies. Please try again.';

export default function useGetAllStrategies() {
  const [state, setState] = useState<State>({
    allStrategies: [],
    hasError: false,
  });

  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const getStrategiesResponse = await fetcher('/strategy/getStrategies');

      if (getStrategiesResponse.status === 200) {
        setState((element) => ({
          ...element,
          allStrategies: getStrategiesResponse?.data?.strategies,
        }));
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

      setState({
        allStrategies: [],
        hasError: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
