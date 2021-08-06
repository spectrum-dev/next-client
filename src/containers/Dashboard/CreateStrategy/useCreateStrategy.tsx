import { useState } from 'react';

import { useHistory } from 'react-router';
import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const ERROR_UNHANDLED_CREATING_STRATEGY = 'There was an error creating the strategy. Please try again';

// Types

interface SaveStrategyPayload {
  strategy_name: string;
}

interface SaveStrategyResponse {
  strategy_id: string;
  strategy_name: string;
}

interface State {
  isLoading: boolean;
  hasError: boolean;
}

export default function useCreateStrategy(
  { strategyName }:
  { strategyName: string },
) {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
  });

  const toast = useToast();
  const history = useHistory();

  const onCreate = async () => {
    try {
      const saveStrategyPayload: SaveStrategyPayload = { strategy_name: strategyName };
      const saveStrategyResponse = await fetcher.post('/strategy/createStrategy', saveStrategyPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (saveStrategyResponse.status === 200) {
        const response: SaveStrategyResponse = saveStrategyResponse.data;
        history.push(`/board/${response.strategy_id}`);

        return response;
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
