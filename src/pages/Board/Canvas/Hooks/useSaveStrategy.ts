import { useEffect } from 'react';
import { useMutation, ApolloError } from '@apollo/client';
import { useToast } from '@chakra-ui/react';


import {
  Inputs, Outputs, Elements,
} from '../index.types';

import { MUTATION_SAVE_STRATEGY } from '../gql';

export default function useSaveStrategy(
  { inputs, outputs, elements, strategyId, commitId }:
  { inputs: Inputs, outputs: Outputs, elements: Elements, strategyId: string, commitId: string },
) {
  const toast = useToast();

  const onError = ({ graphQLErrors }: ApolloError) => {
    toast({
      title: graphQLErrors?.[0].message,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const [saveStrategy] = useMutation(MUTATION_SAVE_STRATEGY, {
    variables: {
      strategyId,
      commitId,
      metadata: elements,
      inputs,
      outputs,
    },
    onError,
  });

  useEffect(() => {
    if (strategyId) {
      saveStrategy();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, outputs, elements]);
}
