import { useState } from 'react';

import { useQuery } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import { QUERY_USER_STRATEGIES } from '../gql';

const GET_ALL_STRATEGIES_RESPONSE_500 = 'There was an error retrieving your strategies. Please try again.';

export interface GetStrategyRecordResponse {
  strategyId: string;
  strategyName: string;
  createdAt: string;
}

interface GetStrategyResponse {
  userStrategies: GetStrategyRecordResponse[];
}

export default function useGetAllStrategies() {
  const [allStrategies, setAllStrategies] = useState<GetStrategyRecordResponse[]>([]);

  const toast = useToast();

  const onCompleted = (data: GetStrategyResponse) => {
    setAllStrategies(data.userStrategies);
  };

  const onError = () => {
    toast({
      title: GET_ALL_STRATEGIES_RESPONSE_500,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    setAllStrategies([]);
  };

  useQuery(QUERY_USER_STRATEGIES, {
    onCompleted,
    onError,
  });

  return { allStrategies, setAllStrategies };
}
