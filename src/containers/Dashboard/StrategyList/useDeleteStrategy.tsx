import { useState } from 'react';

import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const SUCCESS_DELETING_STRATEGY = 'The strategy has been successfully deleted';
const ERROR_UNHANDLED_DELETING_STRATEGY = 'There was an error deleting the strategy. Please try again';

interface State {
  isLoading: boolean;
  hasError: boolean;
}

export default function useDeleteStrategy({ setAllStrategies }: { setAllStrategies: any }) {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
  });

  const toast = useToast();

  const onDelete = async (strategyId: string) => {
    try {
      const deleteStrategyResponse = await fetcher.post(`/strategy/deleteStrategy/${strategyId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (deleteStrategyResponse.status === 200) {
        toast({
          title: SUCCESS_DELETING_STRATEGY,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });

        setAllStrategies((allStrategies: Array<Record<string, string>>) => {
          const updatedStrategies = [];

          for (const strategy of allStrategies) {
            if (strategy.strategy_id !== strategyId) {
              updatedStrategies.push(strategy);
            }
          }
          return updatedStrategies;
        });

        return deleteStrategyResponse.data;
      }

      throw new Error(ERROR_UNHANDLED_DELETING_STRATEGY);
    } catch (e) {
      toast({
        title: ERROR_UNHANDLED_DELETING_STRATEGY,
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
    onDelete,
  };
}
