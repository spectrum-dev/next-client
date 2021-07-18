import { useState } from 'react';

import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const ERROR_UNHANDLED_CREATING_STRATEGY = 'There was an error creating the strategy. Please try again';

interface State {
  isLoading: boolean;
  hasError: boolean;
}

export default function useCreateStrategy(
  { strategyName }:
  { strategyName: String },
) {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
  });

  const toast = useToast();

  const onCreate = async () => {
    try {
      const saveStrategyResponse = await fetcher.post('/strategy/createStrategy', { strategy_name: strategyName });

      if (saveStrategyResponse.status === 200) {
        const response = saveStrategyResponse.data;
        window.location.assign(`https://board.imbue.dev/board/${response.strategy_id}`);

        return saveStrategyResponse.data;
      }
      throw new Error(ERROR_UNHANDLED_CREATING_STRATEGY);
    } catch (e) {
      toast({
        title: ERROR_UNHANDLED_CREATING_STRATEGY,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      setState({
        isLoading: false,
        hasError: true,
      });
      return {};
    }
  };

  return {
    state,
    onCreate,
  };
}
