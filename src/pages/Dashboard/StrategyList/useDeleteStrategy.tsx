import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

import { GetStrategyArrayResponse } from './useGetAllStrategies';

const SUCCESS_DELETING_STRATEGY = 'The strategy has been successfully deleted';
const ERROR_UNHANDLED_DELETING_STRATEGY = 'There was an error deleting the strategy. Please try again';

interface OnDeleteResponse {
  status: 'true' | 'false';
}

export default function useDeleteStrategy(
  { setAllStrategies }:
  { setAllStrategies: React.Dispatch<React.SetStateAction<GetStrategyArrayResponse>> },
) {
  const toast = useToast();

  const onDelete = async (strategyId: string): Promise<OnDeleteResponse | {}> => {
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

        setAllStrategies((allStrategies: GetStrategyArrayResponse) => {
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

      return {};
    }
  };

  return { onDelete };
}
